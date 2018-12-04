
import { Component, OnInit, AfterViewInit, ViewContainerRef, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { element } from 'protractor';
import { TripService, CommonAppService, UserService } from '../../../../../services/index';
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
    selector: 'invoice-itinerary-summary',
    styleUrls: ['./invoice-itinerary-summary.component.css'],
    templateUrl: './invoice-itinerary-summary.component.html'
})

export class InvoiceItinerarySummaryComponent implements OnInit, AfterViewInit, OnChanges {
    public currentUser: any;
    @Input('divID') divID: string = "invoice-itinerary-summary-content-id";
    @Input('itineraryObjectData') itineraryObject = {};
    @Input('allFlightActivitiesSummary') allFlightActivitiesSummary = [];
    @Input('agentId') agentId = {};
    @Input('tripAgentObject') tripAgentObject = {};

    @Input('itineraryFieldsArr') itineraryFieldsArr = [];
    // @Output() itineraryFieldsArrEvent = new EventEmitter<any>();
    // @Output() landmarkDetailInfoEvent = new EventEmitter<any>();
    @Input('landmarkDetailInfo') landmarkDetailInfo = {};

    isImageConverted = {};

    public pageTitle = {};

    constructor(
        public _route: ActivatedRoute,
        public _router: Router,
        public _viewContainerRef: ViewContainerRef,
        public datepipe: DatePipe,
        public _tripService: TripService,
        public _commonAppService: CommonAppService,
        public _userService: UserService
    ) {
        let THIS = this;
        THIS._commonAppService.getCurrentUserSession((user) => {
            THIS.currentUser = user;
            if (THIS._commonAppService.isUndefined(THIS.currentUser)) {
                window.location.href = '/login';
            }
        });
    }

    public ngOnChanges() {
        // let THIS = this;
        // THIS.itineraryObject['flightActivities'] = THIS.allFlightActivitiesSummary;
        // let itineraryKeys: string[] = Object.keys(this.itineraryObject);

        // let itineraryFieldsTimeArr = [];
        // let itineraryFields = {};
        // let populateData: boolean = true;
        // THIS.itineraryFieldsArr = [];
        // THIS.landmarkDetailInfo = {};
        // let timeCounter = 0;
        // let lastMaxTime = "00:00";

        // if (itineraryKeys.length != 0) {
        //     itineraryKeys.forEach(key => {
        //         if (key == "flights" || key == "groundTransfer" || key == "carRentals" || key == "trains" || key == "tours" || key == "cruises" || key == "properties" || key == "flightActivities") {
        //             if (this.itineraryObject[key] != undefined && this.itineraryObject[key].length > 0) {
        //                 this.itineraryObject[key].forEach(element => {
        //                     let date;
        //                     if (key == "flights" || key == "groundTransfer" || key == "carRentals" || key == "trains" || key == "cruises") {
        //                         let timeHour = THIS._commonAppService.getHourFromTime(element.departureTime, lastMaxTime);
        //                         let timeMinute = THIS._commonAppService.getMinFromTime(element.departureTime, lastMaxTime);
        //                         let DATE = new Date(element.departureDate);
        //                         date = new Date(DATE.getUTCFullYear(), (DATE.getUTCMonth() + 1), DATE.getUTCDate(), timeHour, timeMinute, 0, 0);
        //                         lastMaxTime = timeHour + ":" + timeMinute;
        //                     } else if (key == "tours" || key == "properties") {
        //                         let timeHour = THIS._commonAppService.getHourFromTime(element.checkInTime, lastMaxTime);
        //                         let timeMinute = THIS._commonAppService.getMinFromTime(element.checkInTime, lastMaxTime);
        //                         let DATE = new Date(element.checkInDate);
        //                         date = new Date(DATE.getUTCFullYear(), (DATE.getUTCMonth() + 1), DATE.getUTCDate(), timeHour, timeMinute, 0, 0);
        //                         lastMaxTime = timeHour + ":" + timeMinute;
        //                     } else if(key == "flightActivities"){
        //                         let timeHour = THIS._commonAppService.getHourFromTime(element.activityTime, lastMaxTime);
        //                         let timeMinute = THIS._commonAppService.getMinFromTime(element.activityTime, lastMaxTime);
        //                         let DATE = new Date(element.activityDate);
        //                         date = new Date(DATE.getUTCFullYear(), (DATE.getUTCMonth() + 1), DATE.getUTCDate(), timeHour, timeMinute, 0, 0);
        //                         lastMaxTime = timeHour + ":" + timeMinute;
        //                     }

        //                     // if (key == "flights" || key == "groundTransfer" || key == "carRentals" || key == "trains" || key == "cruises") {
        //                     //     element.departureTime = THIS._commonAppService.getCurrentTime(element.departureTime);
        //                     // } else if (key == "tours" || key == "properties" || key == "room") {
        //                     //     element.checkInTime = THIS._commonAppService.getCurrentTime(element.checkInTime);
        //                     // }

        //                     let time = date.getTime();
        //                     if (time in itineraryFields) {
        //                         itineraryFields[time].push([key, element]);

        //                         if (key == "properties") {
        //                             let  _extraNewElement = JSON.parse(JSON.stringify(element));
        //                             _extraNewElement['isCheckOut'] = true;
        //                             // itineraryFields[time].push([key, _extraNewElement]);
        //                         }
        //                     } else {
        //                         itineraryFields[time] = [[key, element]];
        //                         itineraryFieldsTimeArr.push(time);

        //                         if (key == "properties") {
        //                             let  _extraNewElement = JSON.parse(JSON.stringify(element));
        //                             _extraNewElement['isCheckOut'] = true;
        //                             // itineraryFields[time].push([key, _extraNewElement]);
        //                         }
        //                     }

        //                     if (key == "properties") {
        //                         if (element.propertyId && !(element.propertyId in this.landmarkDetailInfo)) {

        //                             this._tripService.getPropertyById(THIS.currentUser , element.propertyId).subscribe((data: any) => {
        //                                 if (data.status == 1 && data.result.property != null) {
        //                                     this.landmarkDetailInfo[data.result.property._id] = data.result.property;
        //                                 }
        //                             },
        //                             (error: any) => {
        //                                 console.log(' error ', error);
        //                             });
        //                         }
        //                         if (element.roomCategories != null && element.roomCategories.length > 0) {
        //                             let cnt1 = 0;
        //                             element.roomCategories.forEach(roomData => {
        //                                 if (!(roomData.roomId in this.landmarkDetailInfo)) {
        //                                     cnt1++;
        //                                     this._tripService.getRoomById(THIS.currentUser, roomData.roomId).subscribe((data: any) => {
        //                                         if (data.status == 1 && data.result.room != null) {
        //                                             let ROOM_DETAILS = {
        //                                                 'basic': data.result.room,
        //                                                 'details': data.result.room
        //                                             };
        //                                             this.landmarkDetailInfo[data.result.room._id] = data.result.room;
        //                                         }
        //                                     },
        //                                     (error: any) => {
        //                                         console.log(' error ', error);
        //                                     });
        //                                 } else {
        //                                     cnt1++;
        //                                 }

        //                                 let timeHour = THIS._commonAppService.getHourFromTime(roomData.checkInTime, lastMaxTime);
        //                                 let timeMinute = THIS._commonAppService.getMinFromTime(roomData.checkInTime, lastMaxTime);
        //                                 let DATE = new Date(roomData.checkInDate);
        //                                 let date = new Date(DATE.getUTCFullYear(), (DATE.getUTCMonth() + 1), DATE.getUTCDate(), timeHour, timeMinute, 0, 0);
        //                                 lastMaxTime = timeHour + ":" + timeMinute;
        //                                 let time = date.getTime();

        //                                 if (time in itineraryFields) {
        //                                     itineraryFields[time].push(['room', roomData]);
        //                                 } else {
        //                                     itineraryFields[time] = [['room', roomData]];
        //                                     itineraryFieldsTimeArr.push(time);
        //                                 }

        //                                 if(cnt1 >= element.roomCategories.length){
        //                                     let  _extraNewElement = JSON.parse(JSON.stringify(element));
        //                                     let time2 = date.getTime();
        //                                     _extraNewElement['isCheckOut'] = true;
        //                                     itineraryFields[time2].push([key, _extraNewElement]);
        //                                 }
        //                             });
        //                         } else {
        //                             let  _extraNewElement = JSON.parse(JSON.stringify(element));
        //                             let time2 = date.getTime();
        //                             _extraNewElement['isCheckOut'] = true;
        //                             itineraryFields[time2].push([key, _extraNewElement]);
        //                         }
        //                     }
        //                     if (key == "cruises") {
        //                         if (element.cruiseId && !(element.cruiseId in this.landmarkDetailInfo)) {
        //                             this._tripService.getCruiseLineById(THIS.currentUser, element.cruiseId).subscribe((data: any) => {
        //                                 if (data.status == 1 && data.result.cruiseline != null) {
        //                                     this.landmarkDetailInfo[data.result.cruiseline._id] = data.result.cruiseline;
        //                                 }
        //                             },
        //                             (error: any) => {
        //                                 console.log(' error ', error);
        //                             });
        //                         }
        //                         if (element.roomCategories != null && element.roomCategories.length > 0) {
        //                             let cnt2 = 0;
        //                             element.roomCategories.forEach(roomData => {
        //                                 if (!(roomData.roomId in this.landmarkDetailInfo)) {
        //                                     cnt2++;
        //                                     this._tripService.getRoomById(THIS.currentUser, roomData.roomId).subscribe((data: any) => {
        //                                         if (data.status == 1 && data.result.room != null) {
        //                                             let ROOM_DETAILS = {
        //                                                 'basic': data.result.room,
        //                                                 'details': data.result.room
        //                                             };
        //                                             this.landmarkDetailInfo[data.result.room._id] = data.result.room;
        //                                         }
        //                                     },
        //                                     (error: any) => {
        //                                         console.log(' error ', error);
        //                                     });
        //                                 } else {
        //                                     cnt2++;
        //                                 }
        //                                 let timeHour = THIS._commonAppService.getHourFromTime(roomData.checkInTime, lastMaxTime);
        //                                 let timeMinute = THIS._commonAppService.getMinFromTime(roomData.checkInTime, lastMaxTime);
        //                                 let DATE = new Date(roomData.checkInDate);
        //                                 let date = new Date(DATE.getUTCFullYear(), (DATE.getUTCMonth() + 1), DATE.getUTCDate(), timeHour, timeMinute, 0, 0);
        //                                 lastMaxTime = timeHour + ":" + timeMinute;
        //                                 let time = date.getTime();
        //                                 if (time in itineraryFields) {
        //                                     itineraryFields[time].push(['room', roomData]);
        //                                 } else {
        //                                     itineraryFields[time] = [['room', roomData]];
        //                                     itineraryFieldsTimeArr.push(time);
        //                                 }

        //                                 if(cnt2 >= element.roomCategories.length){
        //                                     if(element.cruiseItineraries){
        //                                         element.cruiseItineraries.forEach(cruiseData => {
        //                                             cruiseData['cruiseDetails'] = {
        //                                                 "departureDate" : element.departureDate,
        //                                                 "departureTime" : element.departureTime,
        //                                                 "arrivalDate" : element.arrivalDate,
        //                                                 "arrivalTime" : element.arrivalTime,
        //                                                 "isPrimary" : element.isPrimary
        //                                             };

        //                                             cruiseData['itinerary'] = cruiseData['itinerary'].sort(function(a,b) {return (a.dayNo > b.dayNo) ? 1 : ((b.dayNo > a.dayNo) ? -1 : 0);} );
                                                    
        //                                             let time = date.getTime();
        //                                             if (time in itineraryFields) {
        //                                                 itineraryFields[time].push(['cruiseItineraries', cruiseData]);
        //                                             } else {
        //                                                 itineraryFields[time] = [['cruiseItineraries', cruiseData]];
        //                                                 itineraryFieldsTimeArr.push(time);
        //                                             }
        //                                         });
        //                                     }
        //                                 }
        //                             });
        //                         } else {
        //                             if(element.cruiseItineraries){
        //                                 element.cruiseItineraries.forEach(cruiseData => {
        //                                     cruiseData['cruiseDetails'] = {
        //                                         "departureDate" : element.departureDate,
        //                                         "departureTime" : element.departureTime,
        //                                         "arrivalDate" : element.arrivalDate,
        //                                         "arrivalTime" : element.arrivalTime,
        //                                         "isPrimary" : element.isPrimary
        //                                     };

        //                                     cruiseData['itinerary'] = cruiseData['itinerary'].sort(function(a,b) {return (a.dayNo > b.dayNo) ? 1 : ((b.dayNo > a.dayNo) ? -1 : 0);} );

        //                                     let time = date.getTime();
        //                                     if (time in itineraryFields) {
        //                                         itineraryFields[time].push(['cruiseItineraries', cruiseData]);
        //                                     } else {
        //                                         itineraryFields[time] = [['cruiseItineraries', cruiseData]];
        //                                         itineraryFieldsTimeArr.push(time);
        //                                     }
        //                                 });
        //                             }
        //                         }
        //                     }
        //                 });
        //             }
        //         }
        //     });
        //     if (itineraryFieldsTimeArr.length > 0) {

        //         itineraryFieldsTimeArr = itineraryFieldsTimeArr.sort();

        //         itineraryFieldsTimeArr.forEach(key => {
        //             itineraryFields[key].forEach(element => {

        //                 let  _newElement = JSON.parse(JSON.stringify(element));

        //                 if (element[0] == "flights" || element[0] == "groundTransfer" || element[0] == "carRentals" || element[0] == "trains" || element[0] == "cruises") {
        //                     let testDepartureTime = THIS._commonAppService.getCurrentTime(element[1].departureTime);
        //                     _newElement[1].departureTime = testDepartureTime;
        //                 } else if (element[0] == "tours" || element[0] == "properties" || element[0] == "room") {
        //                     let testCheckInTime = THIS._commonAppService.getCurrentTime(element[1].checkInTime);
        //                     _newElement[1].checkInTime = testCheckInTime;
        //                 } else if(element[0] == "flightActivities"){
        //                     let testActivityTime = THIS._commonAppService.getCurrentTime(element[1].activityTime);
        //                     _newElement[1].activityTime = testActivityTime;
        //                 }

        //                 if (element[0] == "cruises") {
        //                     let testArrivalTime = THIS._commonAppService.getCurrentTime(element[1].arrivalTime);
        //                     _newElement[1].arrivalTime = testArrivalTime;
        //                 } else if (element[0] == "trains") {
        //                     let testArrivalTime = THIS._commonAppService.getCurrentTime(element[1].estimatedArrivalTime);
        //                     _newElement[1].estimatedArrivalTime = testArrivalTime;
        //                 } else if (element[0] == "properties") {
        //                     let testCheckOutTime = THIS._commonAppService.getCurrentTime(element[1].checkOutTime);
        //                     // _newElement[1]['isCheckOut'] = false;
        //                     _newElement[1].checkOutTime = testCheckOutTime;
        //                 }

        //                 this.itineraryFieldsArr.push(_newElement);
        //             });
        //         });

        //         this.itineraryFieldsArrEvent.emit(this.itineraryFieldsArr);
        //         this.landmarkDetailInfoEvent.emit(this.landmarkDetailInfo);
        //     }
        // }
    }

    public ngOnInit() {
    }

    public ngAfterViewInit() {
    }

    getFromDate(element: any, flag): string {
        let dateStr: string = "";
        if(flag && (element[0] == "properties" || element[0] == "cruises")){
            return "";
        } else if (element[0] == "flights" || element[0] == "groundTransfer" || element[0] == "carRentals" || element[0] == "trains" || element[0] == "cruises") {
            let date: Date = new Date(element[1].departureDate);
            dateStr = this.datepipe.transform(date, 'EEE, MMM dd, yyyy');
        } else if (element[0] == "tours" || element[0] == "properties" || element[0] == "room") {
            let date: Date = new Date(element[1].checkInDate);
            dateStr = this.datepipe.transform(date, 'EEE, MMM dd, yyyy');
        } else if(element[0] == "flightActivities"){
            let date: Date = new Date(element[1].activityDate);
            dateStr = this.datepipe.transform(date, 'EEE, MMM dd, yyyy');
        }
        return dateStr;
    }

    getFromTime(element: any, flag): string {
        let THIS = this;
        let dateStr: string = "";
        
        if(flag && (element[0] == "properties" || element[0] == "cruises")){
            return "";
        } else if (element != null) {
            if (element[0] == "flights" || element[0] == "groundTransfer" || element[0] == "carRentals" || element[0] == "trains" || element[0] == "cruises") {
                dateStr = element[1].departureTime;
            } else if (element[0] == "tours" || element[0] == "properties" || element[0] == "room") {
                dateStr = element[1].checkInTime;
            } else if(element[0] == "flightActivities"){
                dateStr = element[1].activityTime;
            }
        } 
        return dateStr;
    }
    
    getToTime(element: any, flag): string {
        let THIS = this;
        let dateStr: string = "";
        if(flag && (element[0] == "properties" || element[0] == "cruises")){
            return "";
        } else
         if (element != null) {
            if (element[0] == "cruises") {
                dateStr = element[1].arrivalTime;
            } else if (element[0] == "trains") {
                dateStr = element[1].estimatedArrivalTime;
            } else if (element[0] == "properties") {
                dateStr = element[1].checkOutTime;
            } 
        }
        return dateStr;
    }

    getToDate(element: any, flag): string {
        let dateStr: string = "";
        if(flag && (element[0] == "properties" || element[0] == "cruises")){
            return "";
        } else 
        if (element != null) {
            if (element[0] == "trains") {
                let date: Date = new Date(element[1].estimatedArrivalDate);
                dateStr = this.datepipe.transform(date, 'EEE, MMM dd, yyyy');
            } else if (element[0] == "properties" || element[0] == "room") {
                let date: Date = new Date(element[1].checkOutDate);
                dateStr = this.datepipe.transform(date, 'EEE, MMM dd, yyyy');
            } else if (element[0] == "cruises") {
                let date: Date = new Date(element[1].arrivalDate);
                dateStr = this.datepipe.transform(date, 'EEE, MMM dd, yyyy');
            }
        }
        return dateStr;
    }


    getCruiseData(subCruise: any, cruiseDetails: any): string {
        let THIS = this;
        let dataStr: string = "";
        if(subCruise && cruiseDetails) {
            let date: Date = new Date(cruiseDetails.departureDate);
            date.setDate(date.getDate() + (subCruise.dayNo - 1));
            return this.datepipe.transform(date, 'EEE, MMM dd, yyyy');
        } 
        return ;
    }

    getCruiseArrivalDepartTime(subCruise: any): string {
        let THIS = this;
        let dateStr: string = "";

        let arrivalTime = this._commonAppService.getCurrentTime(subCruise.arrivalTime);
        let departTime = this._commonAppService.getCurrentTime(subCruise.depTime);

        dateStr = arrivalTime + ((departTime != '' && arrivalTime != '')? ' - ' : '') + departTime;
        if(THIS._commonAppService.isUndefined(dateStr)){
            return "";
        } else {
            return dateStr;
        }
    }
    
    // getCruiseDepartTime(subCruise: any): string {
    //     let THIS = this;
    //     let dateStr: string = "";
    //     dateStr = this._commonAppService.getCurrentTime(subCruise.depTime);
    //     return dateStr;
    // }
    
    getCruiseAddress(subCruise: any): string {
        let THIS = this;
        let dateStr: string = "";
        dateStr = (subCruise.port)? subCruise.port.name : '';
        return dateStr;
    }
    
    getCruiseHTML(subCruise: any): string {
        let THIS = this;
        let dateStr: string = "";
        dateStr = (subCruise.port)? subCruise.port.descriptionHTML : '';
        return dateStr;
    }


    getItineraryType(itineraryElem: any): string {
        if (itineraryElem != null) {
            if (itineraryElem[0] == "flights") {
                return "fa fa-fw fa-plane";
            } else if (itineraryElem[0] == "groundTransfer") {
                return "fa fa-fw fa-bus";
            } else if (itineraryElem[0] == "carRentals") {
                return "fa fa-fw fa-car";
            } else if (itineraryElem[0] == "trains") {
                return "fa fa-fw fa-train";
            } else if (itineraryElem[0] == "cruises") {
                return "fa fa-fw fa-ship";
            } else if (itineraryElem[0] == "tours") {
                return "fa fa-fw fa-circle-o-notch";
            } else if (itineraryElem[0] == "properties") {
                return "fa fa-fw fa-bed";
            } else if (itineraryElem[0] == "room") {
                return "fa fa-fw fa-bed";
            }
        }
        return "";
    }
   
    getItineraryType2(itineraryElem: any): string {
        if (itineraryElem != null) {
            if (itineraryElem[0] == "flights") {
                return "text-gray fa fa-2x fa-plane ";
            } else if (itineraryElem[0] == "groundTransfer") {
                return "text-lime fa fa-2x fa-bus";
            } else if (itineraryElem[0] == "flightActivities") {
                return "text-maroon fa fa-2x fa-ticket";
            } else if (itineraryElem[0] == "carRentals") {
                return "text-maroon fa fa-2x fa-car";
            } else if (itineraryElem[0] == "trains") {
                return "text-green fa fa-2x fa-train";
            } else if (itineraryElem[0] == "cruises") {
                return "text-blue fa fa-2x fa-ship";
            } else if (itineraryElem[0] == "tours") {
                return "text-gray fa fa-2x fa-circle-o-notch";
            } else if (itineraryElem[0] == "properties") {
                return "text-orange fa fa-2x fa-bed";
            } else if (itineraryElem[0] == "room") {
                return "text-olive fa fa-2x fa-bed";
            }
        }
        return "";
    }

    getItineraryText(itineraryElem: any, roomFlag, isActivityDisplay): string {
        if (itineraryElem != null) {
            if (itineraryElem[0] == "flights") {
                return itineraryElem[1].flightNumber;
            }
            else if (itineraryElem[0] == "groundTransfer") {
                return itineraryElem[1].location;;
            }
            else if (itineraryElem[0] == "carRentals") {
                return itineraryElem[1].location;;
            }
            else if (itineraryElem[0] == "trains") {
                return itineraryElem[1].trainName + " " + itineraryElem[1].coachNo + " " + itineraryElem[1].seatNo;
            }
            else  if (itineraryElem[0] == "cruises") {
                let cruiseData = this.landmarkDetailInfo[itineraryElem[1].cruiseId];
                // let cruiseName: string = "";
                // if (cruiseData != null) {
                //     cruiseName = cruiseData.name;
                // }
                // return cruiseName;
            }
            else if (itineraryElem[0] == "tours") {
                return itineraryElem[1].tourName;
            } else if (itineraryElem[0] == "properties") {
                let propertyData = this.landmarkDetailInfo[itineraryElem[1].propertyId];
            } else if (itineraryElem[0] == "room") {
                let roomData = this.landmarkDetailInfo[itineraryElem[1].roomId];
                let roomName: string = "";
                if (roomData != null) {
                    roomName = (roomFlag == false)? roomData.name : 'rrrr' + roomData.name;
                }
                return roomName;
            } 
            else if (itineraryElem[0] == "flightActivities" && isActivityDisplay == true) {
                let activityDetails = (itineraryElem[1])? ('Confirmation #: ' + itineraryElem[1]['confirmationNumber']) : '';
                return activityDetails;
            }
        }
        return "";
    }

    getItineraryAddress(itineraryElem: any, flag, isActivityDisplay): string {
        if (itineraryElem != null) {
            if (itineraryElem[0] == "properties") {
                let propertyData = this.landmarkDetailInfo[itineraryElem[1].propertyId];
                let propLoc: string = "";
                if (propertyData != null) {
                    propLoc += (propertyData.address1 && flag)? propertyData.address1 + ',' : '';
                    propLoc += (propertyData.address2 && flag)? propertyData.address2 + ',' : '';
                    propLoc += (propertyData.zip && flag)? propertyData.zip + ',' : '';
                    propLoc += (propertyData.city)? propertyData.city + ',' : '';
                    propLoc += (propertyData.country)? propertyData.country : '';
                }
                return propLoc;
            }
            if (itineraryElem[0] == "cruises") {
                let cruiseData = this.landmarkDetailInfo[itineraryElem[1].cruiseId];
                let cruiseLoc: string = "";
                if(cruiseData!=null){
                    cruiseLoc = itineraryElem[1]['title'];
                }
                return cruiseLoc;
            }
            if (itineraryElem[0] == "flightActivities" && isActivityDisplay == true) {
                let activityDetails = (itineraryElem[1])? (itineraryElem[1]['description']) : '';
                return activityDetails;
            }
        }
        return "";
    }

    getItineraryEmail(itineraryElem: any, checkFlag, tableName: any, isCruiseDisplay, isActivityDisplay): string {
        if (itineraryElem != null) {
            if (itineraryElem[0] == "properties") {
                let propertyData = this.landmarkDetailInfo[itineraryElem[1].propertyId];
                let propName: string = "";
                if (propertyData != null) {
                    propName += (checkFlag)? ((itineraryElem[1]['isCheckOut'])? 'Check-out ' : 'Check-in ') : '';
                    propName += propertyData.name;
                }
                return propName;
            }
            if (itineraryElem[0] == "cruises") {
                let cruiseData = this.landmarkDetailInfo[itineraryElem[1].cruiseId];
                let cruiseName: string = "";
                if (cruiseData != null) {
                    // cruiseName += (checkFlag)? ((itineraryElem[1]['isCheckOut'])? 'Check-out ' : 'Check-in ') : '';
                    cruiseName += (tableName == 'package')? 'Begin your journey aboard ' : '';
                    cruiseName += (itineraryElem[1]['shipName'])? (itineraryElem[1]['shipName'] + ' - ') : '';
                    cruiseName += cruiseData.name;
                    cruiseName += (isCruiseDisplay)? 'cruise' : '';
                }
                return cruiseName;
            }
            if (itineraryElem[0] == "flightActivities" && isActivityDisplay == true) {
                let activityDetails = (itineraryElem[1])? ('activity' + (itineraryElem[1]['activityName'])) : '';
                return activityDetails;
            }
        }
        return "";
    }
    
    getFlightActivityTypeAndName(itineraryElem: any, isType): string {
        if (itineraryElem != null) {
            if (itineraryElem[0] == "flightActivities") {
                let activityDetails = (itineraryElem[1])? (((isType)? (itineraryElem[1]['activity'] + ' - ') : '') + itineraryElem[1]['activityName']) : '';
                return activityDetails;
            }
        }
        return "";
    }
    
    getFlightActivityConfirmationDetails(itineraryElem: any): string {
        if (itineraryElem != null) {
            if (itineraryElem[0] == "flightActivities") {
                let activityDetails = (itineraryElem[1])? ('Confirmation #: ' + itineraryElem[1]['confirmationNumber']) : '';
                return activityDetails;
            }
        }
        return "";
    }
    
    getFlightActivityDesc(itineraryElem: any): string {
        if (itineraryElem != null) {
            if (itineraryElem[0] == "flightActivities") {
                let activityDetails = (itineraryElem[1])? (itineraryElem[1]['description']) : '';
                return activityDetails;
            }
        }
        return "";
    }

    getLandmarkImage(itineraryElem: any): string {
        if (itineraryElem != null) {
            if (itineraryElem[0] == "properties") {
                let propertyData = this.landmarkDetailInfo[itineraryElem[1].propertyId];
                let propImgSrc: string = "";
                if (itineraryElem[1]['isCheckOut'] != true && propertyData != null && propertyData.propertyImages!=null && propertyData.propertyImages.length>0) {
                    propImgSrc = propertyData.propertyImages[0];
                }
                return propImgSrc;
            }
            if (itineraryElem[0] == "cruises") {
                let cruiseData = this.landmarkDetailInfo[itineraryElem[1].cruiseId];
                let cruiseImgSrc: string = "";
                if (itineraryElem[1]['isCheckOut'] != true && cruiseData != null && cruiseData.cruiseImages!=null && cruiseData.cruiseImages.length>0) {
                    cruiseImgSrc = cruiseData.cruiseImages[0];
                }
                return cruiseImgSrc;
            }
        }
        return "";
    }

    showExtraInfo(itineraryElem: any): boolean {
        if (itineraryElem != null) {
            if ((itineraryElem[0] == "properties" && itineraryElem[1]['isCheckOut'] != true)|| (itineraryElem[0] == "cruises" && itineraryElem[1]['isCheckOut'] != true) || itineraryElem[0] == "room") {
                return true;
            }
        }
        return false;
    }

    setBase64Image(img,itineraryElem:any) {

        var canvas = document.createElement("canvas");
    
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
    
        ctx.drawImage(img, 0, 0);
    
        var dataURL = canvas.toDataURL("image/jpeg");
        img.src = dataURL;
        this.isImageConverted[itineraryElem._id]=true;
    
    }

    loadBase64Image(evt:any,itineraryElem:any){
        if(evt!=null && !(itineraryElem._id in this.isImageConverted)){
            this.setBase64Image(evt.currentTarget,itineraryElem);
        }
    }

    public getItineraryIcon(itineraryElem){
        let THIS = this;
        let imagePath = "";
        if(THIS._commonAppService.isUndefined(itineraryElem)){
            return "";
        } else {
            imagePath = "/assets/public/images/itinerary-icons/";

            if (itineraryElem[0] == "flights") {
                return imagePath + 'flightIcon.PNG';
            } else if (itineraryElem[0] == "groundTransfer") {
                return imagePath + 'groundTransferIcon.PNG';
            } else if (itineraryElem[0] == "carRentals") {
                return imagePath + 'carIcon.PNG';
            } else if (itineraryElem[0] == "trains") {
                return imagePath + 'trainIcon.PNG';
            } else if (itineraryElem[0] == "cruises") {
                return imagePath + 'cruiseIcon.PNG';
            } else if (itineraryElem[0] == "tours") {
                return imagePath + 'tourIcon.PNG';
            } else if(itineraryElem[0] == "properties") {
                return imagePath + 'propertyIcon.PNG';
            } else {
                return imagePath + 'roomIcon.PNG';
            }
        }
    }
    
    public getItineraryIcon2x(itineraryElem){
        let THIS = this;
        let imagePath = "";
        if(THIS._commonAppService.isUndefined(itineraryElem)){
            return "";
        } else {
            imagePath = "/assets/public/images/itinerary-icons/";

            if (itineraryElem[0] == "room") {
                return imagePath + 'blank.jpg';
            } else if (itineraryElem[0] == "flights") {
                return imagePath + 'flightIcon2x.PNG';
            } else if (itineraryElem[0] == "groundTransfer") {
                return imagePath + 'groundTransferIcon2x.PNG';
            } else if (itineraryElem[0] == "carRentals") {
                return imagePath + 'carIcon2x.PNG';
            } else if (itineraryElem[0] == "trains") {
                return imagePath + 'trainIcon2x.PNG';
            } else if (itineraryElem[0] == "cruises") {
                return imagePath + 'cruiseIcon2x.PNG';
            } else if (itineraryElem[0] == "tours") {
                return imagePath + 'tourIcon2x.PNG';
            } else if(itineraryElem[0] == "properties") {
                return imagePath + 'propertyIcon2x.PNG';
            } else {
                return imagePath + 'propertyIcon2x.PNG';
            }
        }
    }
    
    public getSmallImageId(itineraryElem, index){
        let THIS = this;
        let imagePath = "";
        if(THIS._commonAppService.isUndefined(itineraryElem)){
            return "";
        } else {
            // imagePath = "/assets/public/images/itinerary-icons/";

            if (itineraryElem[0] == "room" || itineraryElem[0] == "cruiseItineraries") {
                return 'room' + index;
            } else {
                return 'other' + index;
            } 
        }
    }
}


