import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { CommonAppService, UserService, CruiseService } from '../../../services/index';
import { ShipService } from '../../../services/ship.service';

@Component({
  selector: 'app-ship-view',
  providers: [
    CommonAppService,
    UserService,
    ShipService,
    CruiseService
],
  templateUrl: './ship-view.component.html',
  styleUrls: ['./ship-view.component.css']
})
export class ShipViewComponent implements OnInit {

  public currentUser: any;
  public pageCount = 0;
  public limit = 10;
  public totalRecords = 0;
  public currentPageCount = 0;
  public pagerList = [];
  public currentSearchKey = '';
  public currentSearchValue = '';
  public searchObject = {};
  public isSearching = false;
  public pgList = {};
  public shipList = [];
  public cruiseLinesList = [];

  constructor(
    public _route: ActivatedRoute,
    public _router: Router,
    public _commonAppService: CommonAppService,
    public _userService: UserService,
    public _shipService : ShipService,
    public _cruiseService: CruiseService

  ) { 
    _commonAppService.getCurrentUserSession( (user) => {
      this.currentUser = user;
      if (_commonAppService.isUndefined(this.currentUser)) {
          window.location.href = '/login';
      } else if(!_commonAppService.isManagerOrAdmin(this.currentUser.user.roleName)){
          window.location.href = '/dashboard';
      }
  });
  
  this.searchObject = {'name': ''};
    }

    spinnerConfig = {
      bdColor: '#333',
      size: 'large',
      color: '#fff'
  }

  ngOnInit() {
    this.getShipList(0,10);
  }

  public getShipList(pageCount, limit){
        
    this.currentPageCount = (this.isSearching && this.pgList['pages'] && this.pgList['pages'].length < 2)? 0 : pageCount;
    
    let data = { "pageCount": this.currentPageCount, "limit": limit};
    data['search'] = this.searchObject;
    console.log(this.searchObject);

    if(!this.isSearching)
          this._commonAppService.spinner.show();
    
    this._shipService.getShips(this.currentUser, data)
        .subscribe((data: any) => {
            if(data.status == '1'){
                setTimeout(() => {
                    this.shipList = data.result.ships;
                    console.log(this.shipList);
                    this.totalRecords = data.result.totalRecords;
                    this.makeCruiseLinesListByIds();
                    let _pList = this._commonAppService.getPagerList(this.totalRecords, this.limit, this.currentPageCount);
                    this.pgList = (_pList) ? _pList : [];
                }, 0);
            } else {
                this.shipList = [];
                this.totalRecords = 0;
                this.pagerList = [];
                this.pgList['pages'] = [];
            }
            setTimeout(() =>{
                this._commonAppService.spinner.hide();
            },1000); 
            
        },
        (error: any) => {
            console.log(' Error while gettingCruise :  ' + JSON.stringify(error));
        });

}


public removeShipById(shipId,pos:number){
        
    this._commonAppService.showConfirmDialog('This action will remove ship.', (confirmRes) => {
        if(confirmRes == true){
            this._shipService.removeShipById(this.currentUser, shipId)
                .subscribe((data: any) => {
                    this._commonAppService.showSuccessMessage('Alert', data.result.message, function(alertRes){
                       
                    });
                    this.totalRecords = this.totalRecords -1;
                    this.shipList.splice(pos,1);
                },
                (error: any) => {
                    this._commonAppService.showErrorMessage('Alert', error, function(alertRes){});
                });
        }
    });
  }
  

    public onSearchChange(searchKey, searchValue){
      this.checkIsSearching();
      this.getShipList(this.currentPageCount, this.limit);
    }


    public checkIsSearching(){
        
      this.isSearching = false;
      for (var i in this.searchObject) {
          console.log(i);
          if(this.searchObject[i] != ''){
              this.isSearching = true;
          }
      }
    }

    public setPageLimit(option) {
    this.limit = parseInt(option);
    this.getShipList(0, this.limit);
    }

    public refreshShipList(){
        
      this.currentSearchKey = '';
      this.currentSearchValue = '';
      this.searchObject = {"title": "","departurePort":""};
      this.shipList = [];
      this.pageCount = 0;
      this.limit = 10;
      this.totalRecords = 0;
      this.currentPageCount = 0;
      this.pagerList = [];
      this.pgList['pages'] = [];
      this.getShipList(0, this.limit);
    }


    public makeCruiseLinesListByIds() {
        let cruiseLinesIds = [];
        
        this.shipList.forEach((element) => {
            cruiseLinesIds.push(element.cruiseLineId);
        });
        this._cruiseService.listCruiseLinesByIds(this.currentUser,cruiseLinesIds)
          .subscribe(data => {
            this.cruiseLinesList = data.result.cruiseLines
          });
    }

    public getCruiseLineById(cruiseLineId) {
        var obj = this.cruiseLinesList.find((obj) => { return obj._id === cruiseLineId;});
        return (obj)?obj.name:" ";
       }

}
