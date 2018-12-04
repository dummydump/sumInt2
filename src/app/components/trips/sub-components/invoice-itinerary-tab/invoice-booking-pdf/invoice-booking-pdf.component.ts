
import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, ViewContainerRef, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { element } from 'protractor';
import { TripService, CommonAppService, CruiseService, UserService } from '../../../../../services/index';

import { GlobalVariable } from '../../../../../services/static-variable';
declare let jsPDF;
import * as $ from 'jquery';
import * as jpt from 'jspdf-autotable';



@Component({
    providers: [
        TripService,
        CommonAppService,
        UserService,
        DatePipe
    ],
    selector: 'invoice-booking-pdf',
    styleUrls: ['./invoice-booking-pdf.component.css'],
    templateUrl: './invoice-booking-pdf.component.html'
})

export class InvoiceBookingPDFComponent implements OnInit, AfterViewInit, OnChanges {
    public currentUser: any;

    @Input('bookings') bookings=[];
    @Input('itineraryObjectData') itineraryObject = {};
    @Input('tripObject') tripObject = {};
    @Input('tripAgentObject') tripAgentObject = {};
    @Input('payments') payments=[];
    @Input('templateName') templateName;
    @Input('travelerDetails') travelerDetails = [];

    public tripItineraryShortDetails = [];

    public todayDate = "";
    @Input() invoiceNumber:string ;
    public x = 'hello'
    public totalBookingAmount: any = 0;
    public totalPaymentAmount: any = 0;
    public totalBalanceAmount: any = 0;
    public isLocal = true;

    constructor(
        public _commonAppService: CommonAppService,
        public _tripService: TripService,
        public _cruiseService: CruiseService ) {
        this._commonAppService.getCurrentUserSession((user) => {
            this.currentUser = user;
            if (this._commonAppService.isUndefined(this.currentUser)) {
                window.location.href = '/login';
            }
        });
        this.isLocal = (GlobalVariable.BASE_API_URL == 'http://localhost:8088/')? true : false;
        
    }

    public ngOnChanges() {

        let cnt = 0;
        this.totalBookingAmount = 0;
        this.totalPaymentAmount = 0;
        this.totalBalanceAmount = 0;
        this.bookings.forEach(bookingEle => {

            let bookingPaymentAmount = 0;
            let counter = 0;

            console.log(' this.totalBookingAmount ' + this.totalBookingAmount);
            console.log(' bookingEle.packagePrice ' + bookingEle.packagePrice);
            this.totalBookingAmount = (parseFloat(this.totalBookingAmount.toString()) + parseFloat(bookingEle.packagePrice)).toFixed(2);

            this.totalBalanceAmount = (parseFloat(this.totalBalanceAmount.toString()) + parseFloat(this.totalBookingAmount.toString())).toFixed(2);

            cnt++;
            this.payments.forEach((element, i) => {
                if(bookingEle.bookingNumber == element.bookingNumber) {
                    bookingPaymentAmount = bookingPaymentAmount + element.paymentAmount;
                    counter++;
                } else {
                    counter++;
                }

                if(counter >= this.payments.length) {

                    bookingEle.bookingPaymentAmount = bookingPaymentAmount;
                    bookingEle.balance = (bookingEle.packagePrice - bookingPaymentAmount);

                    this.totalPaymentAmount = (parseFloat(this.totalPaymentAmount.toString()) + parseFloat(bookingPaymentAmount.toString())).toFixed(2);

                    this.totalBalanceAmount = (parseFloat(this.totalBalanceAmount.toString()) - parseFloat(this.totalPaymentAmount.toString())).toFixed(2);
                }
            });

            if(cnt >= this.bookings.length) {
                this.totalBalanceAmount = (parseFloat(this.totalBookingAmount.toString()) - parseFloat(this.totalPaymentAmount.toString())).toFixed(2);
            }
        });

        this.todayDate = this._commonAppService.getCalendarDate(new Date(),'notDayname');
        this.getTripDetails(this.itineraryObject);
    }

    public ngOnInit() {

     }

    public ngAfterViewInit() {  }

    public getBookingTotalAmount(bookingNumber) {
    }

    public getTripDetails(itineraryObject){
        this.tripItineraryShortDetails = [];
        if(itineraryObject['cruises'] && itineraryObject['cruises'].length > 0){
            itineraryObject['cruises'].forEach((cruise, index) => {
                if(cruise && cruise.isPrimary == true){
                    this.getCruiseItineraryById(cruise.cruiseItineraryId, (err, cruiseRes) => {
                        cruiseRes.index = index;
                        cruiseRes.type = 'cruise';
                        this.tripItineraryShortDetails.push(cruiseRes);
                    });
                }
            });
        }
        if(itineraryObject['properties'] && itineraryObject['properties'].length > 0){
            itineraryObject['properties'].forEach((prop, index) => {
                if(prop && prop.isPrimary == true){
                    this.getPropById(prop.propertyId, (err, propRes) => {
                        propRes.index = index;
                        propRes.type = 'property';
                        this.tripItineraryShortDetails.push(propRes);
                    });
                }
            });
        }
    }

    public getPropById(propertyId, callback){
        this._tripService.getPropertyById(this.currentUser , propertyId).subscribe((data: any) => {
            if (data.status == 1 && data.result.property != null) {
                callback(null, data.result.property);
            } else {
                callback('Not found', {});
            }
        },
        (error: any) => {
            console.log(' error ', error);
        });
    }

    public getCruiseItineraryById(cruiseItineraryId, callback){
        this._cruiseService.getCruiseItineraryById(this.currentUser, cruiseItineraryId).subscribe((data: any) => {
            if (data.status == 1 && data.result.cruiseitinerary != null) {
                callback(null, data.result.cruiseitinerary);
            } else {
                callback('Not found', {});
            }
        },
        (error: any) => {
            console.log(' error ', error);
        });
    }

}
