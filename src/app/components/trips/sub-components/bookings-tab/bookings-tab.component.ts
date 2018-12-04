/**
 * Bookings Tab Page Component.
 */
import {
    Component, ViewChild, NgModule, OnInit, Output, AfterViewInit,
    EventEmitter, OnDestroy, ElementRef, NgZone, Renderer, Directive, Inject,
    ViewContainerRef, OnChanges, SimpleChanges, Input
} from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonAppService, TripService, UserService, BookingService } from '../../../../services/index';
import { GlobalVariable } from '../../../../services/static-variable';

@Component({
    providers: [
        CommonAppService,
        TripService,
        UserService

    ],
    selector: 'bookings-tab',
    styleUrls: ['./bookings-tab.component.css'],
    templateUrl: './bookings-tab.component.html'
})

export class BookingsTabComponent implements OnInit, AfterViewInit, OnChanges {
    public currentUser: any;
    public bookings = [];
    public pageCount = 0;
    public limit = 10;
    public totalRecords = 0;
    public currentPageCount = 0;
    public pagerList = [];
    public pgList = {
    };
    spinnerConfig = {
        bdColor: '#333',
        size: 'large',
        color: '#fff'
    }
    @Input('tripObject') tripObject;
    @Output() updateCount = new EventEmitter();

    @Output() showBookingTabChange = new EventEmitter();
    constructor(
        public _route: ActivatedRoute,
        public _router: Router,
        public _commonAppService: CommonAppService,
        public _tripService: TripService,
        public _userService: UserService,
        public _viewContainerRef: ViewContainerRef,
        public _bookingService: BookingService
    ) {
        this._commonAppService.getCurrentUserSession((user)=> {
            this.currentUser = user;
            if (this._commonAppService.isUndefined(this.currentUser)) {
                window.location.href = '/login';
            }
        });
    }

    public ngOnInit() {
    }

    public ngAfterViewInit() {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.tripObject) {
            if (!this._commonAppService.isUndefined(this.tripObject) &&
            !this._commonAppService.isUndefined(this.tripObject._id)) {
                if (this.bookings.length == 0) {
                    this.refreshBookings(this.currentPageCount, this.limit);
                }
            }
        }
    }

    public addBooking() {
        if(this._commonAppService.isUndefined(this.tripObject._id)){
            
            this._commonAppService.showErrorMessage('Alert', this._commonAppService.TripNotFoundMessage, function (alertRes) {
            });
            return;
        }
        this.showBookingTabChange.emit({
            showBookingTab: false
        });
    }

    public editBooking(_bookingInfo) {
        if(this._commonAppService.isUndefined(this.tripObject._id)){
            this._commonAppService.showErrorMessage('Alert', this._commonAppService.TripNotFoundMessage, function (alertRes) {
        });
            return;
        }
        this.showBookingTabChange.emit({
            showBookingTab: false
        });
        var _booking_info = Object.assign({}, _bookingInfo);
        this._bookingService.editBooking(_booking_info);
    }

    public deleteBooking(bookingId) {
        if (bookingId) {
            this._commonAppService.showConfirmDialog(this._commonAppService.removeConfirmMessage, (confirmRes)=> {
                if (confirmRes == true) {
                    this.removeBookingById(bookingId, () => {
                        this.refreshBookings(0, 10);
                    });
                }
            });
        }
    }

    private removeBookingById(bookingId, callback) {
        this._bookingService.removeBookingById(this.currentUser, bookingId)
            .subscribe((data: any) => {
                if (data.status == '1') {
                    this._commonAppService.showSuccessMessage('Alert', data.result.message, function (alertRes) {
                    });
                    callback();
                } else {
                    this._commonAppService.showErrorMessage('Alert', data.result.message, function (alertRes) {});
                }
            },
            (error: any) => {
                console.log(' Error while getAllTrips :  ' + JSON.stringify(error));
            });
    }

    public refreshBookings(pageCount, limit) {
        if(this._commonAppService.isUndefined(this.tripObject._id)){
            return;
        }
        this.currentPageCount = pageCount;
        let data = {
            'pageCount': pageCount,
            'limit': limit,
            tripId: this.tripObject._id,

        };

        this._commonAppService.spinner.show();
        this._bookingService.getBookings(this.currentUser, data)
            .subscribe((data: any) => {
                if (data.status === '1') {
                    this.bookings = data.result.bookings;
                    this.totalRecords = data.result.totalRecords;
                    this.updateCount.emit({ bookings: this.totalRecords });
                    let _pList = this._commonAppService.getPagerList(this.totalRecords, this.limit, pageCount);
                    this.pgList = (_pList) ? _pList : [];
                    this._commonAppService.spinner.hide();
                } else {
                    this.bookings = [];
                    this.totalRecords = 0;
                    this.updateCount.emit({ bookings: this.totalRecords });
                    this.pagerList = [];
                    this.pgList = [];
                    this._commonAppService.spinner.hide();
                }
            },
            (error: any) => {
                console.log(' Error while getAllTrips :  ' + JSON.stringify(error));
                this._commonAppService.spinner.hide();
            });
        setTimeout( ()=> {
            this._commonAppService.spinner.hide();
        }, 1000);

    }


    public currentPageCountEvent($event) {
        this.currentPageCount = $event;
        console.log(' this.currentPageCount ' + this.currentPageCount);
        this.refreshBookings(this.currentPageCount, this.limit);
    }

    public limitChangeEvent($event) {
        this.limit = $event;
        this.refreshBookings(0, this.limit);
    }

    public refreshBookingsTab(event) {
        this.refreshBookings(this.currentPageCount, this.limit);
    }
    //getBookings
}
