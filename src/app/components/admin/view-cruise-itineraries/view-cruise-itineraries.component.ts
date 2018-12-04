import { Component, OnInit } from '@angular/core';
import { CommonAppService, CruiseService } from '../../../services/index';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ShipService } from '../../../services/ship.service';
import { PortService } from '../../../services/port.service';





@Component({
    selector: 'app-view-cruise-itineraries',
    providers: [
        CommonAppService,
        UserService,
        CruiseService,
        ShipService,
        PortService

    ],
    templateUrl: './view-cruise-itineraries.component.html',
    styleUrls: ['./view-cruise-itineraries.component.css']
})
export class ViewCruiseItinerariesComponent implements OnInit {

    public currentUser: any;
    public cruiseList = [];
    public pageCount = 0;
    public limit = 10;
    public totalRecords = 0;
    public currentPageCount = 0;
    public pagerList = [];
    public currentSearchKey = '';
    public currentSearchValue = '';
    public searchObject = { "title": "", "departurePort": "", "departurePortIds": [] };
    public isSearching = false;
    public pgList = {};
    public isSpinner = true;
    public ships = [];
    public cruiseLines = [];
    public ports = [];
    public portIds = [];

    constructor(public _route: ActivatedRoute,
        public _router: Router,
        public _commonAppService: CommonAppService,
        public _userService: UserService,
        public _cruiseService: CruiseService,
        public _shipService: ShipService,
        public _portService: PortService
    ) {

        _commonAppService.getCurrentUserSession((user) => {
            this.currentUser = user;
            if (_commonAppService.isUndefined(this.currentUser)) {
                window.location.href = '/login';
            } else if (!_commonAppService.isManagerOrAdmin(this.currentUser.user.roleName)) {
                window.location.href = '/dashboard';
            }
        });

        this.searchObject = { "title": "", "departurePort": "", "departurePortIds": [] };
        this.makeCruiseLinesListByIds();
        this.makePortsListByIds();
        this.makeShipsListByIds();
    }

     spinnerConfig = {
        bdColor: '#333',
        size: 'large',
        color: '#fff'
    }

    ngOnInit() {
        this.getCruiseList(0, 10);
        
    }

    public getPortIdsBySearchValue(callback){
        if(this.searchObject.departurePort && this.searchObject.departurePort != ''){
            let newList = this.ports.filter((port) => {
                return ((port.name.toLowerCase().indexOf(this.searchObject.departurePort.toLowerCase()) != -1))
            });

            let portIds = newList.map((item) => { return item["_id"]; });
            callback((portIds && portIds.length > 0)? portIds : null);
        } else {
            callback(null);
        }
    }

    public getCruiseList(pageCount, limit) {
        this.getPortIdsBySearchValue((portIds) => {
            if(portIds && portIds.length > 0){
                this.filterCruiseList(pageCount, limit, portIds);
            } else {
                this.filterCruiseList(pageCount, limit, portIds);
            }
        });
    }

    public filterCruiseList(pageCount, limit, portIds) {
            
        this.currentPageCount = pageCount;

        let data = { 
            "pageCount": this.currentPageCount, 
            "limit": limit,
            search: this.searchObject,
            portIds: portIds
        };

        if (this.isSpinner && !this.isSearching)
          this._commonAppService.spinner.show();

        this._cruiseService.getAllCruiseItinerariesTitleList(this.currentUser, data)
            .subscribe((data: any) => {
                console.log(data.result);
                if (data.status == '1') {
                    this.cruiseList = data.result.cruiseitineraries;
                    this.totalRecords = data.result.totalRecords;
                    let _pList = this._commonAppService.getPagerList(this.totalRecords, this.limit, this.currentPageCount);
                    this.pgList = (_pList) ? _pList : [];
                } else {
                    this.cruiseList = [];
                    this.totalRecords = 0;
                    this.pagerList = [];
                    this.pgList['pages'] = [];
                }
                setTimeout(() => {
                  this._commonAppService.spinner.hide();
                }, 1000);
             this.isSpinner = true;
            },
            (error: any) => {
                console.log(' Error while gettingCruise :  ' + JSON.stringify(error));
            });
        
    }

    public removeCruiseItinerarieById(cruiseId, pos) {
        this._commonAppService.showConfirmDialog('This action will remove cruise.', (confirmRes) => {
            if (confirmRes == true) {
                this._cruiseService.removeCruiseItinerarieById(this.currentUser, cruiseId)
                    .subscribe((data: any) => {
                        this._commonAppService.showSuccessMessage('Alert', data.result.message, function (alertRes) {

                        });
                        this.totalRecords = this.totalRecords - 1;
                        this.cruiseList.splice(pos, 1);
                    },
                    (error: any) => {
                        this._commonAppService.showErrorMessage('Alert', error, function (alertRes) { });
                    });
            }
        });
    }

    public onSearchChange(searchKey, searchValue) {
        this.checkIsSearching();

        this.getCruiseList(0, this.limit);

    }


    public checkIsSearching() {

        this.isSearching = false;
        for (var i in this.searchObject) {
            if (this.searchObject[i] != '') {
                this.isSearching = true;
            }
        }
    }

    public setPageLimit(option) {
        this.limit = parseInt(option);
        this.getCruiseList(0, this.limit);
    }

    public refreshCruiseItineraryList() {

        this.currentSearchKey = '';
        this.currentSearchValue = '';
        this.searchObject = { "title": "", "departurePort": "", "departurePortIds": [] };
        this.cruiseList = [];
        this.pageCount = 0;
        this.limit = 10;
        this.totalRecords = 0;
        this.currentPageCount = 0;
        this.pagerList = [];
        this.pgList['pages'] = [];
        this.getCruiseList(0, this.limit);
    }



    public getShipById(shipId) {
        var obj = this.ships.find((obj) => { return obj._id === shipId; });
        return obj ? obj.name : '';
    }

    public makeShipsListByIds() {
        let shipsIds = [];

        this.cruiseList.forEach((element) => {
            shipsIds.push(element.shipId);
        });
        this._shipService.listShipsByIds(this.currentUser, shipsIds)
            .subscribe(data => {
                this.ships = data.result.ships;
            })

    }

    public makePortsListByIds() {
        let portsIds = [];

        this.cruiseList.forEach(function (element) {
            portsIds.push(element.departure_port_id);
        });
        this._portService.listPortsByIds(this.currentUser, portsIds)
            .subscribe(data => {
                this.ports = data.result.ports
            });
    }

    public makeCruiseLinesListByIds() {
        let cruiseLinesIds = [];

        this.cruiseList.forEach((element) => {
            cruiseLinesIds.push(element.cruise_line_id);
        });
        this._cruiseService.listCruiseLinesByIds(this.currentUser, cruiseLinesIds)
            .subscribe(data => {
                this.cruiseLines = data.result.cruiseLines
            });
    }


    public getCruiseLineById(cruiseLineId) {
        var obj = this.cruiseLines.find((obj) => { return obj._id === cruiseLineId; });
        return obj ? obj.name : '';
    }


    public getPortById(portId) {
        var obj = this.ports.find((obj) => { return obj._id === portId; });
        return obj ? obj.name : '';
    }


}
