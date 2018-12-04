
/**
 * Bookings Tab Page Component.
 */
import {
    Component, ViewChild, NgModule, OnInit, Output, AfterViewInit,
    EventEmitter, OnDestroy, ElementRef, NgZone, Renderer, Directive,
    Inject, ViewContainerRef, OnChanges, SimpleChanges, Input
} from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonAppService, TripService, UserService, BookingService, TourOperatorsService, SettingsService,InvoiceService } from '../../../../services/index';
import { GlobalVariable } from '../../../../services/static-variable';
import { DatePipe } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';

@Component({
    providers: [
        CommonAppService,
        TripService,
        UserService,
        TourOperatorsService,
        InvoiceService,
        SettingsService,
        DatePipe, CurrencyPipe
    ],
    selector: 'bookings-info-tab',
    styleUrls: ['./bookings-info-tab.component.css'],
    templateUrl: './bookings-info-tab.component.html'
})

export class BookingsInfoTabComponent implements OnInit, AfterViewInit, OnChanges {
    public currentUser: any;
    public tourOperatorsList = [];
    public statusTypes = [];
    public alternateCommisionList = [];
    public tripDescription = '';
    public commisionNametoShow = 'standard commisions rate';
    public bookingInfo = {
        '_id': 0,
        'tripId': '',
        'bookingNumber': '',
        'groupBookingId': '',
        'bookingDate': '',
        'tourOperatorId': '',
        'startDate': '',
        'endDate': '',
        'packagePrice': 0,
        'commisionEarned': 0,
        'alternateCommision': '',
        'personalTravel': false,
        'commisionExpected': '',
        'agentName': '',
        'bookingStatus': 'Active',
        'description': '',
    }
    public commisionExpectedInfo = [];
    @Input('tripObject') tripObject;
    @Input('showBookingTab') showBookingTab;
    //@Output() updateCount = new EventEmitter();
    @Output() showBookingTabChange = new EventEmitter();
    @Output() refreshBookings = new EventEmitter();
    @Output() isReflectBooking = new EventEmitter();
    subscription: Subscription;
    public maxDate = "";
    constructor(
        public _route: ActivatedRoute,
        public _router: Router,
        public _commonAppService: CommonAppService,
        public _tripService: TripService,
        public _userService: UserService,
        public _viewContainerRef: ViewContainerRef,
        public _bookingService: BookingService,
        public _tourOperatorsService: TourOperatorsService,
        public _settingsService: SettingsService,
        private _datePipe: DatePipe,
        public _invoiceServices: InvoiceService
    ) {
        this._commonAppService.getCurrentUserSession((user) => {
            this.currentUser = user;
            if (this.currentUser) {
                this.bookingInfo.agentName = this.currentUser.user.firstName + " " + this.currentUser.user.lastName;
            }
            if (this._commonAppService.isUndefined(this.currentUser)) {
                window.location.href = '/login';
            }
        });
        this.getTourOperatorsList();
        this.getStatusTypes();
        this.getAlternateCommisionList();
        this.bookingInfo.bookingNumber = this._datePipe.transform(new Date(), 'yyyy-MM-dd-HH-mm-ss');
        this.bookingInfo.bookingDate = this._datePipe.transform(new Date(), 'yyyy-MM-dd');

    }

    public ngOnInit() {
        console.log(' 1this.tripObject.endDate ', this.tripObject);
        this.maxDate = (this.tripObject)? new Date(this.tripObject.endDate).toJSON().split('T')[0] : new Date().toJSON().split('T')[0];
        console.log(' maxDate ' + this.maxDate);
        this._bookingService.initEditBooking$.subscribe(_bookingInfo => {
            if (!this._commonAppService.isUndefined(_bookingInfo._id)) {
                this.bookingInfo = _bookingInfo;
                this.commisionNametoShow = _bookingInfo.alternateCommision;
            }
        });
    }

    public ngAfterViewInit() {
        console.log(' 2this.tripObject.endDate ', this.tripObject);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.tripObject) {
            if (!this._commonAppService.isUndefined(this.tripObject)) {
                this.tripDescription = this.tripObject.tripDescription;
                this.bookingInfo.startDate = this.tripObject.startDate;
                this.bookingInfo.endDate = this.tripObject.endDate;
                //  this.bookingInfo.bookingNumber = this.tripObject.tripDescription;
            }
        }
        if (changes.showBookingTab && !this.showBookingTab) {
            this.resetBookingInfo();
            this.bookingInfo.bookingNumber = this._datePipe.transform(new Date(), 'yyyy-MM-dd-HH-mm-ss');
            this.bookingInfo.bookingDate = this._datePipe.transform(new Date(), 'yyyy-MM-dd');
            if (this.alternateCommisionList.length > 0) {
                this.bookingInfo.alternateCommision = this.alternateCommisionList[0].name;
            }
        }
    }

    public getTourOperatorsList() {
        this._tourOperatorsService.getTourOperators(this.currentUser, {})
            .subscribe((data: any) => {
                if (data.status === '1') {
                    this.tourOperatorsList = data.result.tour_operators;
                } else {
                    this.tourOperatorsList = [];
                }
            },
            (error: any) => {
                console.log(' Error while getAllAgents :  ' + JSON.stringify(error));
            });
    }
    public getAlternateCommisionList() {
        var data = {
            settingObject: GlobalVariable.SETTING_KEYS.ALTERNATE_COMMISSION
        }
        this._settingsService.getSettingByKey(this.currentUser, data)
            .subscribe((data: any) => {
                if (data.status === '1') {
                    if (data.result.settings.length > 0) {
                        this.alternateCommisionList = data.result.settings[0].settingValues;
                        if (this.alternateCommisionList.length > 0) {
                            this.bookingInfo.alternateCommision = this.alternateCommisionList[0].name;
                        }
                    }
                    else {
                        this.alternateCommisionList = [];
                    }

                } else {
                    this.alternateCommisionList = [];
                }
            },
            (error: any) => {
                console.log(' Error while getAllAgents :  ' + JSON.stringify(error));
            });
    }
    public getStatusTypes() {
        this.statusTypes = [{
            name: 'Active',
            val: 'Active'
        }, {
            name: 'Inactive',
            val: 'Inactive'
        }];
    }
    public calculateCommisionExpected(event) {

        var _commisionEarned = this.bookingInfo.commisionEarned;
        var alternateCommision = this.bookingInfo.alternateCommision;
        if (alternateCommision !== "" && _commisionEarned !== 0) {
            if (this.bookingInfo.personalTravel) {
                this.bookingInfo.commisionExpected = _commisionEarned.toString();
            }
            else {
                this.getCommisionDetails(alternateCommision, (details) =>{
                    if (details) {
                        var expected = (parseFloat(_commisionEarned.toString()) * parseFloat(details[0].value)) / 100;
                        this.bookingInfo.commisionExpected = expected.toString();
                        this.commisionNametoShow = details[0].name;
                    }
                });
            }
        }

        // 'commisionEarned': '',
        //	'alternateCommision': '',

        //	'commisionExpected': '',
    }
    
    public getCommisionDetails(commisionName, callback) {
        console.log(' commisionName '  + commisionName);
        console.log(' this.alternateCommisionList ' + JSON.stringify(this.alternateCommisionList));

        let result = this.alternateCommisionList.filter(x=> x.name === commisionName);
        console.log(' result '  + JSON.stringify(result));
        callback(result);
        // for (var i = 0; i < this.alternateCommisionList.length; i++) {
        //     if (commisionName === this.alternateCommisionList[i].name) {
        //         return this.alternateCommisionList[i];
        //     }
        // }
        // return null;
    }

    public closeTab() {
        this.showBookingTabChange.emit({
            showBookingTab: true
        });
        this.resetBookingInfo();
    }

    public saveBooking(isClose,e:any) {
            e.target.disabled = true;
        this.saveAndUpdateBooking(() => {
            if (isClose) {
                this.showBookingTabChange.emit({
                    showBookingTab: true
                });
                this.resetBookingInfo();
            }
            else {
                var _booking_info = Object.assign({}, this.bookingInfo);
                this._bookingService.editBooking(_booking_info);
            }
            this.refreshBookings.emit();
            this.isReflectBooking.emit();
        })
    }

    public resetBookingInfo() {
        this.bookingInfo.bookingNumber = '';
        this.bookingInfo.groupBookingId = '';
        this.bookingInfo.bookingDate = '';
        this.bookingInfo.tourOperatorId = '';
        this.bookingInfo.packagePrice = 0;
        this.bookingInfo.commisionEarned = 0;
        this.bookingInfo.alternateCommision = '';
        this.bookingInfo.personalTravel = false;
        this.bookingInfo.commisionExpected = '';
        this.bookingInfo.bookingStatus = 'Active';
        this.bookingInfo.description = '';
        this.bookingInfo.agentName = this.currentUser.user.firstName + " " + this.currentUser.user.lastName;
        this.bookingInfo.bookingNumber = this._datePipe.transform(new Date(), 'yyyy-MM-dd-HH-mm-ss');
        this.bookingInfo.bookingDate = this._datePipe.transform(new Date(), 'yyyy-MM-dd');
        this.bookingInfo._id = 0;
    }
    public saveAndUpdateBooking(suceess) {
        this.bookingInfo.tripId = this.tripObject._id;
        var data = this.bookingInfo;
        if (!this.isValidatedData(data)) {
            return;
        }
        this._commonAppService.spinner.show();
        if (data._id == 0 || this._commonAppService.isUndefined(data._id)) {
            this._bookingService.addBooking(this.currentUser, data, false)
                .subscribe((res: any) => {
                    if (res.status === '1') {
                        this.bookingInfo._id = res.result._id;
                        this._commonAppService.showSuccessMessage('Alert', res.result.message, function (alertRes) {
                        });

                        // invoice number
                        this._invoiceServices.getInvoiceByTripId(this.currentUser,data.tripId)
                            .subscribe((res:any) => {
                                if(res.status == '0'){
                                    var invoice = {
                                        "tripId" :data.tripId,
                                    }
                                    this._invoiceServices.addInvoice(this.currentUser,invoice,false)
                                    .subscribe((res:any)=> {
                                        console.log(res);
                                    });
                                }
                            },
                            (error:any)=> {
                                console.log(' Error while getInvoiceByTripId :  ' + JSON.stringify(error));
                            });

                        //end invoice

                        suceess();
                    } else {
                        this._commonAppService.showErrorMessage('Alert', res.result.message, function (alertRes) {
                        });
                    }
                },
                (error: any) => {
                    console.log(' Error while getAllTrips :  ' + JSON.stringify(error));
                });
        } else {
            this._bookingService.updateBookingById(this.currentUser, data)
                .subscribe((res: any) => {
                    if (res.status === '1') {
                        this._commonAppService.showSuccessMessage('Alert', res.result.message, function (alertRes) {
                        });
                        suceess();
                    } else {
                        this._commonAppService.showErrorMessage('Alert', res.result.message, function (alertRes) {
                        });
                    }
                },
                (error: any) => {
                    console.log(' Error while getAllTrips :  ' + JSON.stringify(error));
                });
        }
        setTimeout(() => {
            this._commonAppService.spinner.hide();
        }, 1000);
    }

    public typeaHeadTourOperatorOnSelect(e: any): void {
        // let propertyId = e.item._id;

        // THIS.allPropertyList.forEach(property => {
        //     if(property._id == propertyId){
        //         THIS.propertiesList[index]['propertyId'] = propertyId;
        //         console.log('THIS.propertiesList', THIS.propertiesList);
        //     }
        // });
    }
    public showValidationMessage(message) {
        this._commonAppService.showErrorMessage('Alert', message, function (alertRes) {
        });
    }

    public showCommisionDetails() {
        this.commisionExpectedInfo = [];
        this.getCommisionDetails(this.bookingInfo.alternateCommision, (details) =>{
            console.log(' details '  + JSON.stringify(details));
            this.commisionExpectedInfo = [{
                legalName: "CupCakes Castles Travel Company",
                rate: "100%",
                type: "(agency rate)",
                expected: this.bookingInfo.commisionEarned
            }];
            if(details && details.length > 0){
                this.commisionExpectedInfo.push({
                    legalName: this.bookingInfo.agentName,
                    rate: details[0].value,
                    type: "(agent rate)",
                    expected: this.bookingInfo.commisionExpected
                });
            }
        });
    }

    public isValidatedData(booking) {
        if (booking.tripId.trim() === '') {
            this.showValidationMessage('Trip Id is required');
            return false;
        }
        if (booking.bookingNumber.trim() === '') {
            this.showValidationMessage('Booking Number is required');
            return false;
        }
        if (booking.bookingDate === '') {
            this.showValidationMessage('Booking Date is required');
            return false;
        }
        if (booking.bookingDate > this.tripObject.endDate) {
            this.showValidationMessage('Booking Date should not be more than trip end date.');
            return false;
        }
        if (booking.startDate > this.tripObject.endDate || booking.enddate > this.tripObject.endDate) {
            this.showValidationMessage('Booking Start Date and End Date should not be more than trip end date.');
            return false;
        }
        if (booking.packagePrice === 0) {
            this.showValidationMessage('Package Price is required');
            return false;
        }
        if (booking.tourOperatorId === '') {
            this.showValidationMessage('Tour traveler is required');
            return false;
        } else {
            let result = this.tourOperatorsList.filter(x => x.name === booking.tourOperatorId);
            if(result && result.length <= 0){
                this.showValidationMessage('Please select proper tour traveler');
                return false;
            }
        }
        if (parseFloat(booking.commisionEarned) >= parseFloat(booking.packagePrice)) {
            this.showValidationMessage('Commission Earned should not be grate then Package Price.');
            return false;
        }
        return true;
    }

    ngOnDestroy() {
        // prevent memory leak when component is destroyed
        try {
            this.subscription.unsubscribe();
        }
        catch (e) { }
    }
}
