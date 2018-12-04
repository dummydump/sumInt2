/**
 * FlightsActivity Tab Page Component.
 */
// tslint:disable-next-line:max-line-length
import { Component, ViewChild, NgModule, OnInit, Output, AfterViewInit, EventEmitter, OnDestroy, ElementRef, NgZone, Renderer, Directive, Inject, ViewContainerRef, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonAppService, TripService, UserService, FlightActivity,SettingsService } from '../../../../services/index';
import { GlobalVariable } from '../../../../services/static-variable';


@Component({
    providers: [
        CommonAppService,
        TripService,
        UserService,
        FlightActivity,
        SettingsService
    ],
    selector: 'flights-activity-tab',
    styleUrls: ['./flights-activity-tab.component.css'],
    templateUrl: './flights-activity-tab.component.html'
})

export class FlightsActivityTabComponent implements OnInit, AfterViewInit, OnChanges {
    public currentUser: any;
    public activityObject = {};
    public flightActivityList = [];
    public allFlightActivities = [];
    @Output() onPDFAllFlightActivities: EventEmitter<any> = new EventEmitter<any>();
    @Output() onSummaryAllFlightActivities: EventEmitter<any> = new EventEmitter<any>();

    public pageCount = 0;
    public limit = 10;
    public totalRecords = 0;
    public currentPageCount = 0;
    public pagerList = [];

    public limitFlight = 10;
    public totalRecordsFlight = 0;
    public pgListFlight = {};

    public currentSearchKey = '';
    public currentSearchValue = '';
    public searchObject = {};
    public isSearching = false;
    public show: boolean = false;
    public isFlightLoaderShow: boolean = false;
    public isActivityLoaderShow: boolean = false;
    public currentFlight = {
        departureDate: '',
        departureTime: '',
        flightNumber: '',
        isPrimary: ''
    };
    public currentUnchangedFlight = null;
    public isFlightEditMode = false;
    public isValidFlightData = true;
    @Input('tripObject') tripObject;
    @Input() childFlightCount;
    @Input() flightListData;
    spinnerConfig = {
        bdColor: '#333',
        size: 'large',
        color: '#fff'
    };

    public oldObj: any;
    public oldVal: any;

    public isEditActivityMode = 0;
    public pgList = {};
    public currentFlightList= [];
    public activityList = [];
    constructor(
        public _route: ActivatedRoute,
        public _router: Router,
        public _commonAppService: CommonAppService,
        public _tripService: TripService,
        public _userService: UserService,
        public _flightActivityService: FlightActivity,
        public _viewContainerRef: ViewContainerRef,
        public _settingsService: SettingsService
    ) {


        this._commonAppService.getCurrentUserSession( (user) => {
            this.currentUser = user;
            if (this._commonAppService.isUndefined(this.currentUser)) {
                window.location.href = '/login';
            }
        });


        this.activityObject = {
            '_id': '',
            'tripId': '',
            'activity': '',
            'activityDate': (this.tripObject) ? this.tripObject['startDate'] : this._commonAppService.getDateMMDDYYYY(new Date()),
            'activityTime': '',
            'activityName': 'Active',
            'confirmationNumber': '',
            'description': ''
        };

    }

    public ngOnInit() {
        this.getFlightActivityList(0, this.limit);
        this.getActivityList();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.flightActivityList.length == 0) {
        this.RefreshFlightActivity();
        }
        if (changes.tripObject) {
             if (!this._commonAppService.isUndefined(this.tripObject)) {
             }
        }
        if (changes.flightListData) {
            this.flightListData = changes.flightListData.currentValue;
            this.totalRecordsFlight = this.flightListData.length;
            this.paginateFlight(0);
        }
    }

    public paginateFlight (page_number) {
        if(page_number>-1){
            this.isFlightLoaderShow = true;
            this._commonAppService.spinner.show();
            let page_size = this.limitFlight;
            this.currentFlightList =  this.flightListData.slice(page_number * page_size, (page_number + 1) * page_size);
            let _pList = this._commonAppService.getPagerList(this.totalRecordsFlight, this.limitFlight, page_number);
            this.pgListFlight = (_pList) ? _pList : [];
            
            setTimeout( () => {
                this._commonAppService.spinner.hide();
                this.isFlightLoaderShow =false;
            }, 1000);
        }
    }

    public getActivityList() {
        let THIS = this;
        var data = {
            settingObject: GlobalVariable.SETTING_KEYS.ACTIVITY
          };
        THIS._settingsService.getSettingByKey(THIS.currentUser, data)
            .subscribe((data: any) => {
                if (data.status === '1') {
                    if (data.result.settings.length > 0) {
                        THIS.activityList = THIS.orderBy(data.result.settings[0].settingValues, 'name');
                    } else {
                        THIS.activityList = [];
                    }
                } else {
                    THIS.activityList = [];
                }
            },
            (error: any) => {
                console.log(' Error while getAllAgents :  ' + JSON.stringify(error));
            });
    }
    public orderBy(array, orderBy, asc = true){
 
        if (!orderBy || orderBy.trim() == ''){
          return array;
        }
        //ascending
        if (asc) {
          return Array.from(array).sort((item1: any, item2: any) => {
            return this.orderByComparator(item1[orderBy], item2[orderBy]);
          });
        } else {
          //not asc
          return Array.from(array).sort((item1: any, item2: any) => { 
            return this.orderByComparator(item2[orderBy], item1[orderBy]);
          });
        }
    }
    orderByComparator(a: any, b: any): number {
          if (a.toLowerCase() < b.toLowerCase()) { return -1; }
          if (a.toLowerCase() > b.toLowerCase()) { return 1; }

        return 0; //equal each other
    }
    editFlight(flight) {
        this.currentFlight = Object.assign({}, flight);
        this.currentUnchangedFlight = flight;
        this.isFlightEditMode = true;
        this.isFlightLoaderShow = true;
    }

    cancelEditFlight() {
        this.currentFlight.departureDate = this.currentUnchangedFlight.departureDate;
        this.currentFlight.departureTime = this.currentUnchangedFlight.departureTime;
        this.currentFlight.flightNumber = this.currentUnchangedFlight.flightNumber;
        this.currentFlight.isPrimary = this.currentUnchangedFlight.isPrimary;
        this.isFlightEditMode = false;
        this.isValidFlightData = true;
    }

    @Output() childEvent = new EventEmitter();
    saveFlight() {
        if (this.isValidFlightData) {

            this._commonAppService.spinner.show();
            this.currentUnchangedFlight.departureDate = this.currentFlight.departureDate;
            this.currentUnchangedFlight.departureTime = this.currentFlight.departureTime;
            this.currentUnchangedFlight.flightNumber = this.currentFlight.flightNumber;
            this.currentUnchangedFlight.isPrimary = this.currentFlight.isPrimary;
            this.childEvent.emit(false);
            this.isFlightEditMode = false;
            setTimeout( () => {
                this._commonAppService.spinner.hide();
                this.isFlightLoaderShow = false;
            }, 1000);
        } else {
            // tslint:disable-next-line:max-line-length
            this._commonAppService.showErrorMessage('Alert', 'Flight Date should be between trip start and end date.', function (alertRes) { });
            return;
        }
    }

    removeFlight(flight, index) {

        this._commonAppService.showConfirmDialog(this._commonAppService.removeConfirmMessage,  (confirmRes) => {
            if (confirmRes == true) {
                this.flightListData.splice(index, 1);
                this.childEvent.emit(false);

            }
        });

    }
    public ngAfterViewInit() {

    }

    public saveFlightActivity(flag) {
        if(this._commonAppService.isUndefined(this.tripObject._id)){
            this._commonAppService.showErrorMessage('Alert', this._commonAppService.TripNotFoundMessage, function (alertRes) {
            });
            return;
        }
        this.activityObject['tripId'] = this.tripObject._id;
        if (this._commonAppService.isUndefined(this.activityObject['tripId']) || this._commonAppService.isUndefined(this.activityObject['activityDate']) || this._commonAppService.isUndefined(this.activityObject['activityName'])|| this._commonAppService.isUndefined(this.activityObject['activityTime'])) {
            this._commonAppService.showErrorMessage('Alert', this._commonAppService.requiredFieldMessage, function (alertRes) {});
        } else {
            this._flightActivityService.addUpdateTripActivity(this.currentUser, this.activityObject, this.isEditActivityMode)
                .subscribe((data: any) => {
                    if (data.status == '1') {
                        this._commonAppService.showSuccessMessage('Alert', data.result.message, function (alertRes) { });
                        this.RefreshFlightActivity();
                    } else {
                        this._commonAppService.showErrorMessage('Alert', data.result.message, function (alertRes) { });
                    }
                },
                (error: any) => {
                    this._commonAppService.showErrorMessage('Alert', error, function (alertRes) { });

                });
        }
    }

    public RefreshFlightActivity() {
        if(this._commonAppService.isUndefined(this.tripObject._id)){
            return;
        }
        this.isActivityLoaderShow = true;
        this.getFlightActivityList(0, this.limit);
    }

    public currentPageCountEvent($event){
        this.currentPageCount = $event;
        this.getFlightActivityList(this.currentPageCount, this.limit);
    }
    
    public limitChangeEvent($event){
        this.limit = $event;
        this.getFlightActivityList(0, this.limit);
    }

    public getFlightActivityList(pageCount, limit) {
        
        this.currentPageCount = pageCount;

        let data = {
            'pageCount': pageCount,
            'limit': limit,
            tripId: this.tripObject._id,
            search: this.searchObject
        };

        if (this.currentSearchKey != '' && this.currentSearchValue != '') {
            data['searchBy'] = this.currentSearchKey;
            data['searchValue'] = this.currentSearchValue;
        }
        this.isActivityLoaderShow = true;
        this._commonAppService.spinner.show();
        this._flightActivityService.getTripActivity(this.currentUser, data)
            .subscribe((data: any) => {
                if (data.status == '1') {
                    this.flightActivityList = data.result.trips;
                    //this.totalRecords = data.result.totalRecords;
                    let _pList = this._commonAppService.getPagerList(this.totalRecords, this.limit, pageCount);
                    this.pgList = (_pList) ? _pList : [];
                    this.show = false;
                } else {
                    this.flightActivityList = [];
                    this.totalRecords = 0;
                    this.pagerList = [];
                    this.pgList['pages'] = [];
                    this.show = false;
                }
            },
            (error: any) => {
                console.log(' Error while getAllTrips :  ' + JSON.stringify(error));
            });
        setTimeout( () => {
            this._commonAppService.spinner.hide();
            this.isActivityLoaderShow =false;
        }, 1000);


        let tripActivityData = {
            tripId: this.tripObject._id
        };

        this._flightActivityService.getAllTripActivity(this.currentUser, tripActivityData)
            .subscribe((activityData: any) => {
                if (activityData.status == '1') {
                    this.allFlightActivities = activityData.result.tripactivities;
                    this.totalRecords = activityData.result.totalRecords;
                    console.log(this.totalRecords);
                    this.onPDFAllFlightActivities.emit(this.allFlightActivities);
                    this.onSummaryAllFlightActivities.emit(this.allFlightActivities);
                } else {
                    this.allFlightActivities = [];
                }
            },
            (error: any) => {
                console.log(' Error while getAllTripActivity :  ' + JSON.stringify(error));
            });

    }

    public editFlightActivity(activityId) {
        
        if (!this._commonAppService.isUndefined(activityId)) {
            this._flightActivityService.getTripActivityById(this.currentUser, activityId)
                .subscribe((data: any) => {
                    this.activityObject = data.result.trip;
                    this.show = true;
                },
                (error: any) => {
                    console.log(' Error while getUserById :  ' + JSON.stringify(error));
                });
        }
    }

    public removeFlightActivity(activityId) {
        
        this._commonAppService.showConfirmDialog(this._commonAppService.removeConfirmMessage,  (confirmRes) => {
            if (confirmRes == true) {
                this._flightActivityService.removeTripActivityById(this.currentUser, activityId)
                    .subscribe((data: any) => {
                        this.RefreshFlightActivity();
                        this._commonAppService.showSuccessMessage('Alert', data.result.message, function(alertRes){ 
                    });
                },
                    (error: any) => {
                        this._commonAppService.showErrorMessage('Alert', error, function (alertRes) { });
                    });
            }
        });
    }

    public validateActivityDate(date, Time) {
        
        let _TIME = null;
        let checkDate = this._commonAppService.getAsDate(date, (_TIME == null || _TIME == '') ? '00:00' : _TIME);
        let _tripStartDate = this._commonAppService.getAsDate(this.tripObject['startDate'], '00:00');
        let _tripEndDate = this._commonAppService.getAsDate(this.tripObject['endDate'], '23:59');

        if (checkDate >= _tripStartDate && checkDate <= _tripEndDate) {
        } else {
            // tslint:disable-next-line:max-line-length
            this._commonAppService.showErrorMessage('Alert', 'Activity Date should be between trip start and end date.', function (alertRes) { });
        }

    }
    
    
    public validateFlightDates(valueType, oldObject, oldValue, date, time, type, index, subCategoryIndex, itineraryTypeIndex) {
        
        let _TIME = null;
        let checkDate = this._commonAppService.getAsDate(date, (_TIME == null || _TIME == '') ? '00:00' : _TIME);
        let _tripStartDate = this._commonAppService.getAsDate(this.tripObject['startDate'], '00:00');
        let _tripEndDate = this._commonAppService.getAsDate(this.tripObject['endDate'], '23:59');

        if (checkDate >= _tripStartDate && checkDate <= _tripEndDate) {
            this.isValidFlightData = true;
        } else {
            this.isValidFlightData = false;
            // tslint:disable-next-line:max-line-length
            this._commonAppService.showErrorMessage('Alert', 'Flight Date should be between trip start and end date.', function (alertRes) { });
        }

    }
    
    public closePage() {
        this.show = false;
    }
    public getFormatedTime(activityTime) {
        if(activityTime=="")
        {
            return "";
        }
        var H = +activityTime.substr(0, 2);
        var h = (H % 12) || 12;
       // h = (h < 10)?("0"+h):h;  // leading 0 at the left for 1 digit hours
        var ampm = H < 12 ? " AM" : " PM";
        activityTime = h + activityTime.substr(2, 3) + ampm;
        return activityTime;
    }
    public validateActivityTime(selectedTime)
    {
        if(selectedTime=="")
        {
            this._commonAppService.showErrorMessage('Alert', "Activity time should be a valid time.", function (alertRes) { });
            return false;
        }
    }
    public toggle() {
        
        //this.show = !this .show;
        this.show =true;
        this .activityObject = {
            '_id': '',
            'tripId': '',
            'activity': '',
            'activityDate': (this.tripObject) ? this.tripObject['startDate'] : this._commonAppService.getDateMMDDYYYY(new Date()),
            'activityTime': '',
            'activityName': '',
            'confirmationNumber': '',
            'description': ''
        };
    }
}
