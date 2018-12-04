/**
 * Invoice & Itinerary Tab Page Component.
 */
// tslint:disable-next-line:max-line-length
import { Component, ViewChild, NgModule, Input, OnInit, Output, AfterViewInit, EventEmitter, OnDestroy, ElementRef, NgZone, Renderer, Directive, Inject, ViewContainerRef, OnChanges, ChangeDetectorRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonAppService, TripService, UserService, BookingService, InvoiceService } from '../../../../services/index';
import { GlobalVariable } from '../../../../services/static-variable';
import { Http, Response, Headers, Request, RequestOptions, RequestMethod, URLSearchParams } from '@angular/http';

declare let jsPDF;
import * as autoTable from 'jspdf-autotable';

@Component({
    providers: [
        CommonAppService,
        TripService,
        UserService,
        InvoiceService
    ],
    selector: 'invoice-itinerary-tab',
    styleUrls: ['./invoice-itinerary-tab.component.css'],
    templateUrl: './invoice-itinerary-tab.component.html'
})

export class InvoiceItineraryTabComponent implements OnInit, AfterViewInit, OnChanges {
    public currentUser: any;
    public templateName = 'Itinerary';
    @Input('itineraryObjectData') itineraryObject = {};
    @Input('allFlightActivitiesSummary') allFlightActivitiesSummary = [];
    @Input('allFlightActivitiesPDF') allFlightActivitiesPDF = [];
    @Input('travelerDetails') travelerDetails = [];
    public tripNewTravelerList = [];
    @Input('bookings') bookings = [];
    @Input('payments') payments = [];


    public pdfAllFlightActivities = [];
    public summaryAllFlightActivities = [];

    @Input('filteredClientsList') filteredClientsList = [];
    public shipsList = [];
    @Input('tripObject') tripObject = {};
    @Input('tripAgentObject') tripAgentObject = {};

    public itineraryFieldsArr = [];
    public landmarkDetailInfo = {};

    public tripAgent = {};
    public invoiceNumber = "";

    public itineraryFieldsTimeArr;
    public currentPath = "";
    public tripId = "";
    // public bookings = [];
    // public payments = [];
    public agentObject = {};

    public fileDetail: any = { 'fileName': '', 'createdAt': '' };
    public isSendingItineraryMail = false;

    constructor(
        public _http: Http,
        public _route: ActivatedRoute,
        public _router: Router,
        public _commonAppService: CommonAppService,
        public _tripService: TripService,
        public _userService: UserService,
        public _bookingService: BookingService,
        public _viewContainerRef: ViewContainerRef,
        private cdr: ChangeDetectorRef,
        public _invoiceServices: InvoiceService
    ) {
        let THIS = this;
        THIS.currentPath = window.location.href;
        // THIS._tripService.getAllShips(THIS.currentUser, {})
        //     .subscribe((data: any) => {
        //         if (data.status == '1') {
        //             setTimeout(() => {
        //                 THIS.shipsList = data.result.ships;
        //             }, 0);
        //         } else {
        //             THIS.shipsList = [];
        //         }
        //     },
        //     (error: any) => {
        //         console.log(' Error while getAllShips :  ' + JSON.stringify(error));
        //     });
        this.tripId = _route.snapshot.params['tripId'];
        THIS._commonAppService.getCurrentUserSession((user) => {
            THIS.currentUser = user;
            if (THIS._commonAppService.isUndefined(THIS.currentUser)) {
                window.location.href = '/login';
            }
        });

    }

    public ngOnChanges() {
        

        this.pdfAllFlightActivities = this.allFlightActivitiesPDF;
        this.summaryAllFlightActivities = this.allFlightActivitiesSummary;

        let THIS = this;
        THIS.itineraryObject['flightActivities'] = THIS.allFlightActivitiesSummary;
        let itineraryKeys: string[] = Object.keys(this.itineraryObject);

        let itineraryFieldsTimeArr = [];
        let itineraryFields = {};
        let populateData: boolean = true;
        THIS.itineraryFieldsArr = [];
        THIS.landmarkDetailInfo = {};
        let timeCounter = 0;
        let lastMaxTime = "00:00";

        if (itineraryKeys.length != 0) {
            itineraryKeys.forEach(key => {
                if (key == "flights" || key == "groundTransfer" || key == "carRentals" || key == "trains" || key == "tours" || key == "cruises" || key == "properties" || key == "flightActivities") {
                    if (this.itineraryObject[key] != undefined && this.itineraryObject[key].length > 0) {
                        this.itineraryObject[key].forEach(element => {
                            let date;
                            if (key == "flights" || key == "groundTransfer" || key == "carRentals" || key == "trains" || key == "cruises") {
                                let timeHour = THIS._commonAppService.getHourFromTime(element.departureTime, lastMaxTime);
                                let timeMinute = THIS._commonAppService.getMinFromTime(element.departureTime, lastMaxTime);
                                let DATE = new Date(element.departureDate);
                                date = new Date(DATE.getUTCFullYear(), (DATE.getUTCMonth() + 1), DATE.getUTCDate(), timeHour, timeMinute, 0, 0);
                                lastMaxTime = timeHour + ":" + timeMinute;
                            } else if (key == "tours" || key == "properties") {
                                let timeHour = THIS._commonAppService.getHourFromTime(element.checkInTime, lastMaxTime);
                                let timeMinute = THIS._commonAppService.getMinFromTime(element.checkInTime, lastMaxTime);
                                let DATE = new Date(element.checkInDate);
                                date = new Date(DATE.getUTCFullYear(), (DATE.getUTCMonth() + 1), DATE.getUTCDate(), timeHour, timeMinute, 0, 0);
                                lastMaxTime = timeHour + ":" + timeMinute;
                            } else if (key == "flightActivities") {
                                let timeHour = THIS._commonAppService.getHourFromTime(element.activityTime, lastMaxTime);
                                let timeMinute = THIS._commonAppService.getMinFromTime(element.activityTime, lastMaxTime);
                                let DATE = new Date(element.activityDate);
                                date = new Date(DATE.getUTCFullYear(), (DATE.getUTCMonth() + 1), DATE.getUTCDate(), timeHour, timeMinute, 0, 0);
                                lastMaxTime = timeHour + ":" + timeMinute;
                            }

                            // if (key == "flights" || key == "groundTransfer" || key == "carRentals" || key == "trains" || key == "cruises") {
                            //     element.departureTime = THIS._commonAppService.getCurrentTime(element.departureTime);
                            // } else if (key == "tours" || key == "properties" || key == "room") {
                            //     element.checkInTime = THIS._commonAppService.getCurrentTime(element.checkInTime);
                            // }

                            let time = date.getTime();
                            if (time in itineraryFields) {
                                itineraryFields[time].push([key, element]);

                                if (key == "properties") {
                                    let _extraNewElement = JSON.parse(JSON.stringify(element));
                                    _extraNewElement['isCheckOut'] = true;
                                    // itineraryFields[time].push([key, _extraNewElement]);
                                }
                            } else {
                                itineraryFields[time] = [[key, element]];
                                itineraryFieldsTimeArr.push(time);

                                if (key == "properties") {
                                    let _extraNewElement = JSON.parse(JSON.stringify(element));
                                    _extraNewElement['isCheckOut'] = true;
                                    // itineraryFields[time].push([key, _extraNewElement]);
                                }
                            }

                            if (key == "properties") {
                                if (element.propertyId && !(element.propertyId in this.landmarkDetailInfo)) {

                                    this._tripService.getPropertyById(THIS.currentUser, element.propertyId).subscribe((data: any) => {
                                        if (data.status == 1 && data.result.property != null) {
                                            this.landmarkDetailInfo[data.result.property._id] = data.result.property;
                                        }
                                    },
                                        (error: any) => {
                                            console.log(' error ', error);
                                        });
                                }
                                if (element.roomCategories != null && element.roomCategories.length > 0) {
                                    let cnt1 = 0;
                                    element.roomCategories.forEach(roomData => {
                                        if (!(roomData.roomId in this.landmarkDetailInfo)) {
                                            cnt1++;
                                            this._tripService.getRoomById(THIS.currentUser, roomData.roomId).subscribe((data: any) => {
                                                if (data.status == 1 && data.result.room != null) {
                                                    let ROOM_DETAILS = {
                                                        'basic': data.result.room,
                                                        'details': data.result.room
                                                    };
                                                    this.landmarkDetailInfo[data.result.room._id] = data.result.room;
                                                }
                                            },
                                                (error: any) => {
                                                    console.log(' error ', error);
                                                });
                                        } else {
                                            cnt1++;
                                        }

                                        let timeHour = THIS._commonAppService.getHourFromTime(roomData.checkInTime, lastMaxTime);
                                        let timeMinute = THIS._commonAppService.getMinFromTime(roomData.checkInTime, lastMaxTime);
                                        let DATE = new Date(roomData.checkInDate);
                                        let date = new Date(DATE.getUTCFullYear(), (DATE.getUTCMonth() + 1), DATE.getUTCDate(), timeHour, timeMinute, 0, 0);
                                        lastMaxTime = timeHour + ":" + timeMinute;
                                        let time = date.getTime();

                                        if (time in itineraryFields) {
                                            itineraryFields[time].push(['room', roomData]);
                                        } else {
                                            itineraryFields[time] = [['room', roomData]];
                                            itineraryFieldsTimeArr.push(time);
                                        }

                                        if (cnt1 >= element.roomCategories.length) {
                                            let _extraNewElement = JSON.parse(JSON.stringify(element));
                                            let time2 = date.getTime();
                                            _extraNewElement['isCheckOut'] = true;
                                            itineraryFields[time2].push([key, _extraNewElement]);
                                        }
                                    });
                                } else {
                                    let _extraNewElement = JSON.parse(JSON.stringify(element));
                                    let time2 = date.getTime();
                                    _extraNewElement['isCheckOut'] = true;
                                    itineraryFields[time2].push([key, _extraNewElement]);
                                }
                            }
                            if (key == "cruises") {
                                if (element.cruiseId && !(element.cruiseId in this.landmarkDetailInfo)) {
                                    this._tripService.getCruiseLineById(THIS.currentUser, element.cruiseId).subscribe((data: any) => {
                                        if (data.status == 1 && data.result.cruiseline != null) {
                                            this.landmarkDetailInfo[data.result.cruiseline._id] = data.result.cruiseline;
                                        }
                                    },
                                        (error: any) => {
                                            console.log(' error ', error);
                                        });
                                }
                                if (element.roomCategories != null && element.roomCategories.length > 0) {
                                    let cnt2 = 0;
                                    element.roomCategories.forEach(roomData => {
                                        if (!(roomData.roomId in this.landmarkDetailInfo)) {
                                            cnt2++;
                                            this._tripService.getRoomById(THIS.currentUser, roomData.roomId).subscribe((data: any) => {
                                                if (data.status == 1 && data.result.room != null) {
                                                    let ROOM_DETAILS = {
                                                        'basic': data.result.room,
                                                        'details': data.result.room
                                                    };
                                                    this.landmarkDetailInfo[data.result.room._id] = data.result.room;
                                                }
                                            },
                                                (error: any) => {
                                                    console.log(' error ', error);
                                                });
                                        } else {
                                            cnt2++;
                                        }
                                        let timeHour = THIS._commonAppService.getHourFromTime(roomData.checkInTime, lastMaxTime);
                                        let timeMinute = THIS._commonAppService.getMinFromTime(roomData.checkInTime, lastMaxTime);
                                        let DATE = new Date(roomData.checkInDate);
                                        let date = new Date(DATE.getUTCFullYear(), (DATE.getUTCMonth() + 1), DATE.getUTCDate(), timeHour, timeMinute, 0, 0);
                                        lastMaxTime = timeHour + ":" + timeMinute;
                                        let time = date.getTime();
                                        if (time in itineraryFields) {
                                            itineraryFields[time].push(['room', roomData]);
                                        } else {
                                            itineraryFields[time] = [['room', roomData]];
                                            itineraryFieldsTimeArr.push(time);
                                        }

                                        if (cnt2 >= element.roomCategories.length) {
                                            if (element.cruiseItineraries) {
                                                element.cruiseItineraries.forEach(cruiseData => {
                                                    cruiseData['cruiseDetails'] = {
                                                        "departureDate": element.departureDate,
                                                        "departureTime": element.departureTime,
                                                        "arrivalDate": element.arrivalDate,
                                                        "arrivalTime": element.arrivalTime,
                                                        "isPrimary": element.isPrimary
                                                    };

                                                    cruiseData['itinerary'] = cruiseData['itinerary'].sort(function (a, b) { return (a.dayNo > b.dayNo) ? 1 : ((b.dayNo > a.dayNo) ? -1 : 0); });

                                                    let time = date.getTime();
                                                    if (time in itineraryFields) {
                                                        itineraryFields[time].push(['cruiseItineraries', cruiseData]);
                                                    } else {
                                                        itineraryFields[time] = [['cruiseItineraries', cruiseData]];
                                                        itineraryFieldsTimeArr.push(time);
                                                    }
                                                });
                                            }
                                        }
                                    });
                                } else {
                                    if (element.cruiseItineraries) {
                                        element.cruiseItineraries.forEach(cruiseData => {
                                            cruiseData['cruiseDetails'] = {
                                                "departureDate": element.departureDate,
                                                "departureTime": element.departureTime,
                                                "arrivalDate": element.arrivalDate,
                                                "arrivalTime": element.arrivalTime,
                                                "isPrimary": element.isPrimary
                                            };

                                            cruiseData['itinerary'] = cruiseData['itinerary'].sort(function (a, b) { return (a.dayNo > b.dayNo) ? 1 : ((b.dayNo > a.dayNo) ? -1 : 0); });

                                            let time = date.getTime();
                                            if (time in itineraryFields) {
                                                itineraryFields[time].push(['cruiseItineraries', cruiseData]);
                                            } else {
                                                itineraryFields[time] = [['cruiseItineraries', cruiseData]];
                                                itineraryFieldsTimeArr.push(time);
                                            }
                                        });
                                    }
                                }
                            }
                        });
                    }
                }
            });
            if (itineraryFieldsTimeArr.length > 0) {

                itineraryFieldsTimeArr = itineraryFieldsTimeArr.sort();

                itineraryFieldsTimeArr.forEach(key => {
                    itineraryFields[key].forEach(element => {

                        let _newElement = JSON.parse(JSON.stringify(element));

                        if (element[0] == "flights" || element[0] == "groundTransfer" || element[0] == "carRentals" || element[0] == "trains" || element[0] == "cruises") {
                            let testDepartureTime = THIS._commonAppService.getCurrentTime(element[1].departureTime);
                            _newElement[1].departureTime = testDepartureTime;
                        } else if (element[0] == "tours" || element[0] == "properties" || element[0] == "room") {
                            let testCheckInTime = THIS._commonAppService.getCurrentTime(element[1].checkInTime);
                            _newElement[1].checkInTime = testCheckInTime;
                        } else if (element[0] == "flightActivities") {
                            let testActivityTime = THIS._commonAppService.getCurrentTime(element[1].activityTime);
                            _newElement[1].activityTime = testActivityTime;
                        }

                        if (element[0] == "cruises") {
                            let testArrivalTime = THIS._commonAppService.getCurrentTime(element[1].arrivalTime);
                            _newElement[1].arrivalTime = testArrivalTime;
                        } else if (element[0] == "trains") {
                            let testArrivalTime = THIS._commonAppService.getCurrentTime(element[1].estimatedArrivalTime);
                            _newElement[1].estimatedArrivalTime = testArrivalTime;
                        } else if (element[0] == "properties") {
                            let testCheckOutTime = THIS._commonAppService.getCurrentTime(element[1].checkOutTime);
                            // _newElement[1]['isCheckOut'] = false;
                            _newElement[1].checkOutTime = testCheckOutTime;
                        }

                        this.itineraryFieldsArr.push(_newElement);
                    });
                });

                // this.itineraryFieldsArrEvent.emit(this.itineraryFieldsArr);
                // this.landmarkDetailInfoEvent.emit(this.landmarkDetailInfo);
            }
        }

        this._tripService.getTripById(this.currentUser, this.tripId)
        .subscribe(data => {
            if (data.status == "1") {
                this.tripNewTravelerList = (data.result.newTravelerDetails) ? data.result.newTravelerDetails : [];
                this.agentObject = data['result']['trip']['agent'];
            }
        });
        
    }


    public ngOnInit() {
        let obj = { "tripId": this.tripId }
        // this.getBookingInfomation();


        this._invoiceServices.getInvoiceByTripId(this.currentUser, this.tripId)
            .subscribe((res: any) => {
                if (res.status == '1') {
                    this.invoiceNumber = res.result.invoice[0].invoiceNumber;
                    //console.log(res.result.invoice);
                }

                //this.invoiceNumber = res.result.invoice
            },
            (error: any) => {
                console.log(' Error while getInvoiceByTripId :  ' + JSON.stringify(error));
            });
    }

    templateChange(){
        this.cdr.detectChanges();
    }

    public getBookingInfomation() {
        let obj = { "tripId": this.tripId }

        this._bookingService.getAllBookingsByTripId(this.currentUser, obj)
            .subscribe(data => {
                if (data.status == "1") {
                    this.bookings = data.result.bookings;
                    this._bookingService.getPaymentByTripId(this.currentUser, obj)
                        .subscribe(payment => {
                            if (payment.status == "1") {
                                this.payments = payment.result.payments;
                            }
                        });
                }
            });
    }

    ngAfterViewInit() { }

    itineraryFieldsArrEvent($event) {
        // this.itineraryFieldsTimeArr = $event;
    }

    landmarkDetailInfoEvent($event) {
        // this.landmarkDetailInfo = $event;
    }

    public makePDF() {
        let THIS = this;
        this.isSendingItineraryMail = true;
        let _HTML = (this.templateName == "Itinerary") ? document.getElementById('pdfItineraryId').innerHTML : document.getElementById('pdfBookingId').innerHTML;

        let data = {
            'pdfName': new Date().getTime() + '.pdf',
            'pdfHtml': _HTML
        };

        THIS._tripService.downloadPDF(THIS.currentUser, data).subscribe(data => {
            THIS.isSendingItineraryMail = false;
        });
    }

    public emailTrip(sendToType) {
        this.getEmailList(sendToType, (mailArray) => {
            console.log("mailArray : " + JSON.stringify(mailArray));
            if(mailArray.length > 0){
                this.isSendingItineraryMail = true;

                let flage = (this.templateName == "Itinerary") ? 'Itinerary' : 'Invoice'
                let _HTML = (flage == "Itinerary") ? document.getElementById('pdfItineraryId').innerHTML : document.getElementById('pdfBookingId').innerHTML;

                let data = {
                    'sendTo': mailArray,
                    'subject': '',
                    'body': '',
                    'htmlBody': '',
                    'itineraryId': this.itineraryObject['_id'],
                    'link': GlobalVariable.CLIENT_TRIP_DETAIL_URL + this.tripId,
                    'pdfName': (flage == "Itinerary") ? new Date().getTime() + '.pdf' : 'Invoice-' + new Date().getTime() + '.pdf',
                    "agentFullName": this.agentObject['agentFirstName'] + ' ' + this.agentObject['agentLastName'],
                    'pdfHtml': _HTML
                }

                this._tripService.sendItineraryEmail(this.currentUser, data, flage).subscribe(data => {
                    this.isSendingItineraryMail = false;
                    console.log("data : data : " + JSON.stringify(data));
                    if (data.status == '0') {

                        this._commonAppService.showErrorMessage('Alert', data.result.error, function (alertRes) { });
                    } else {
                        this._commonAppService.showSuccessMessage('Alert', data.result.message, function (alertRes) { });
                    }
                },
                (error: any) => {
                    console.log(' Error while sendItineraryEmail :  ' + JSON.stringify(error));
                });
            }

        });

    }

    public getEmailList(sendToType, callback){
        let mailArray = [];
        if (sendToType != 'user') {
            mailArray.push({ "mailId": this.currentUser['user']['email'] });
            callback(mailArray);
        } else {
            this.travelerDetails.forEach(element => {
                mailArray.push({ "mailId": element['emailId'] });
            });
            // callback(mailArray);
            callback([]);
        }
        
    }

    public selectClient(event) {
        let THIS = this;
        if (!(event.target.files)) {
            THIS._commonAppService.showErrorMessage('Alert', 'Select Excel Sheet', function (alertRes) { });
        } else if (event.target.files) {
            var reader = new FileReader();
            reader.onload = (event: any) => {
                let localUrl = event.target.result;
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    }

}
