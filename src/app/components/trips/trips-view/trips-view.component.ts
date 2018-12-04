/**
 * Trips View Page Component.
 */
// tslint:disable-next-line:max-line-length
import { Component, ViewChild, NgModule, OnInit, Output, AfterViewInit, EventEmitter, OnDestroy, ElementRef, NgZone, Renderer, Directive, Inject, ViewContainerRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonAppService, TripService, UserService,EventsService, ClientService } from '../../../services/index';
import { GlobalVariable } from '../../../services/static-variable';

@Component({
    providers: [
        CommonAppService,
        TripService,
        EventsService,
        UserService,
        ClientService
    ],
    styleUrls: ['./trips-view.component.css'],
    templateUrl: './trips-view.component.html'
})

export class TripsViewComponent implements OnInit, AfterViewInit {
    public currentUser: any;
    public tripsList = [];
    public agentsList = [];
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
    public travelersList = [];

    constructor(
        public _route: ActivatedRoute,
        public _router: Router,
        public _commonAppService: CommonAppService,
        public _tripService: TripService,
        public _userService: UserService,
        public _eventsService: EventsService,
        public _viewContainerRef: ViewContainerRef,
        public _clientService:  ClientService
    )  {
        this._commonAppService.getCurrentUserSession( (user) => {
            this.currentUser = user;
            if (this._commonAppService.isUndefined(this.currentUser)) {
                window.location.href = '/login';
            }
        });

        this.searchObject = { 'agent': '', 'leadGuest': '', 'tripType': '', 'startDate': '', 'endDate': '', 'primary': '' };
        this.getAgentList();
    }

    spinnerConfig = {
        bdColor: '#333',
        size: 'large',
        color: '#fff'
      };
    public ngOnInit() {
        this.getTripList(0, 10);
    }

    public ngAfterViewInit() { }

    public currentPageCountEvent($event){
        this.currentPageCount = $event;
        this.getTripList(this.currentPageCount, this.limit);
    }

    public limitChangeEvent($event){
        this.limit = $event;
        this.getTripList(0, this.limit);
    }


    public getTripList(pageCount, limit) {

        this.currentPageCount = (this.isSearching && this.pgList['pages'] && this.pgList['pages'].length < 2)? 0 : pageCount;


        let data = { 'pageCount': this.currentPageCount, 'limit': limit };
        data['search'] = this.searchObject;

        if (this.currentSearchKey != '' && this.currentSearchValue != '') {
            data['searchBy'] = this.currentSearchKey;
            data['searchValue'] = this.currentSearchValue;
        }
        // if(!this.isSearching)
        this._commonAppService.spinner.show();

        this._tripService.getAllTrips(this.currentUser, data)
            .subscribe((data: any) => {
                if (data.status == '1') {
                    setTimeout(() => {
                        this.travelersList = data.result.travelerDetails;
                        this.tripsList = data.result.trips;
                        this.totalRecords = data.result.totalRecords;
                        let _pList = this._commonAppService.getPagerList(this.totalRecords, this.limit, this.currentPageCount);
                        this.pgList = (_pList) ? _pList : [];
                    }, 0);
                } else {
                    this.tripsList = [];
                    this.totalRecords = 0;
                    this.pagerList = [];
                    this.pgList['pages'] = [];
                }
                this._commonAppService.spinner.hide();
            },
            (error: any) => {
                console.log(' Error while getAllTrips :  ' + JSON.stringify(error));
            });
    }

    public getAgentList() {
        this._userService.getAllUsers(this.currentUser, {})
            .subscribe((data: any) => {
                if (data.status == '1') {
                    setTimeout(() => {
                        this.agentsList = data.result.users;
                    }, 0);
                } else {
                    this.agentsList = [];
                }
            },
            (error: any) => {
                console.log(' Error while getAllUsers :  ' + JSON.stringify(error));
            });
    }

    public removeTripById(tripId ,trip) {
        var travellerIds = [];
        for(var i=0;i<trip.travelerDetails.length;i++){
            travellerIds[i]=trip.travelerDetails[i].travelerId;
        }
        this._commonAppService.showConfirmDialog(this._commonAppService.removeConfirmMessage,  (confirmRes) => {
            if (confirmRes == true) {
                
                this._commonAppService.spinner.show();
                this._eventsService.removeEventByTripId(this.currentUser,tripId)
                .subscribe((d: any) => {
                    this._tripService.removeTripById(this.currentUser, tripId)
                        .subscribe((data: any) => {
                            if(data.status == true){
                                this._commonAppService.spinner.hide();
                                console.log(data.result);
                                this._commonAppService.showSuccessMessage('Alert', data.result.message, function (alertRes) {
                                });
                                this._clientService.decreaseTripCountersByClientIds(this.currentUser, travellerIds)
                                .subscribe((data:any)=>{
                                    setTimeout(()=> {
                                        if(data && data.status=='0'){
                                            console.log("Failed to decrease the trip counter");
                                        }
                                        else{
                                            console.log("Successfully decreased Trip counter for ");
                                        }
                                    },
                                    (error: any) => {
                                        console.log('error occured while calling the api');
                                    });
                                });
                                this.refreshTripList();
                            }
                            else{
                                this._commonAppService.spinner.hide();
                                data.result.message = data.result.message.replace('ve','be');
                                this._commonAppService.showErrorMessage('Error', data.result.message, function (alertRes) {
                                });
                            }
                          
                        },
                        (error: any) => {
                            this._commonAppService.spinner.hide();
                            this._commonAppService.showErrorMessage('Alert', error, function (alertRes) { });
                        });
                });
            }
        });
    }

    public onSearchChange(searchKey, searchValue) {
        this.checkIsSearching();
        this.currentSearchKey = searchKey;
        this.currentSearchValue = searchValue;
        this.getTripList(this.currentPageCount, this.limit);
    }

    public checkIsSearching() {
        this.isSearching = false;
        for (var i in this.searchObject) {
            if (this.searchObject[i] != '') {
                this.isSearching = true;
            }
        }
    }

    public refreshTripList() {

        this.currentSearchKey = '';
        this.currentSearchValue = '';
        this.searchObject = { 'agent': '', 'guest': '', 'category': '', 'startDate': '', 'endDate': '', 'primary': '' };
        this.tripsList = [];
        this.pageCount = 0;
        this.limit = 10;
        this.totalRecords = 0;
        this.currentPageCount = 0;
        this.pagerList = [];
        this.pgList['pages'] = [];
        this.getTripList(0, this.limit);
    }

    public getLeadGuestOfTrip(trip) {

        let _traveler = trip['travelerDetails'];

        var filteredArray = _traveler.filter( (itm) => {
            return (itm.travelerType == 'primary');
        });

        let _leadName = '';
        if (filteredArray[0]) {

            for(var i=0;i<this.travelersList.length ;i++)
            {
                if(filteredArray[0].travelerId == this.travelersList[i].travelerId)
                {
                    _leadName = this.travelersList[i].firstName + " "+ this.travelersList[i].lastName;
                    return _leadName;
                }
            }
            _leadName =  (_traveler[0] && _traveler[0]['traveler'])? JSON.stringify(filteredArray[0]['traveler']['firstName']) + ' ' + JSON.stringify(filteredArray[0]['traveler']['lastName']) : '';
        }

        return "";

    }

    public setPageLimit(option) {
        this.limit = parseInt(option);
        this.getTripList(0, this.limit);
    }
}
