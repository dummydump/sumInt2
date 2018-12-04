
/**
 * Trip Add Page Component.
 */
import { Component, ViewChild, NgModule, OnInit, Output, AfterViewInit, EventEmitter, OnDestroy, ElementRef, NgZone, Renderer, Directive, Inject, ViewContainerRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonAppService, UserService, TripService, ClientService, ItineraryService, LocalStorageService, PropertyService, CruiseService, RoomService, FlightActivity, EventsService, BookingService, GoogleCalendarEventsService } from '../../../services/index';
import { GlobalVariable } from '../../../services/static-variable';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { ThrowStmt } from '@angular/compiler';
@Component({
    providers: [
        CommonAppService,
        UserService,
        TripService,
        ClientService,
        ItineraryService,
        LocalStorageService,
        PropertyService,
        CruiseService,
        BookingService,
        FlightActivity,
        EventsService,
        GoogleCalendarEventsService,
        RoomService,
        DatePipe
    ],
    styleUrls: ['./trip-add.component.css'],
    templateUrl: './trip-add.component.html'
})

export class TripAddComponent implements OnInit, AfterViewInit {
    public currentUser: any;
    public isTripEditMode = false;
    public tripPageHeadingText = "";
    public tripEvent;
    public _tripStartDate = "";
    public travelerFlage = true;
    public tripObject = {
        "_id": "", "tripType": "", "startDate": "", "endDate": "", "agent": { "agentFirstName": "", "agentLastName": "", "agentId": "" }, "tripStatus": "", "tripDescription": "", "workspaceExtensions": [], "travelerDetails": [], "primary": {}
    };

    public tripAgentObject = {}
    public travelerObject = { "travelerId": "", "travelerType": "primary", "traveler": null }
    public tripNewTravelerList = [];
    public agentsList = [];
    public clientsList = [];
    public filteredClientsList = [];
    public contactDetails = [];
    public tripPayments = [];
    public isAddTraveler = false;
    public travelerTypeList = [];
    public isTravelerEditMode = false;
    public allPropertyList = [];
    public allCruiseList = [];
    public cruiseAutocompleteList = [];
    public propertyAutocompleteList = [];
    public clientComplex = [];
    public allCruiseItinerariesTitleList = [];
    public allRoomList = [];
    public propertyRoomList = [];
    public cruiseRoomList = [];
    public shipsList = [];
    public newCruiseName: string;
    public typeaheadNoResults: boolean;
    public newClientName: string;
    public selectedEditTraveler: any;
    /* traveler paggination */
    public pageCount = 0;
    public limit = 1;
    public totalRecords = 0;
    public currentPageCount = 0;
    public pagerList = [];
    public travelerDetailsList = [];
    public agentSelect = '';
    public selectedAgent = '';
    /* Trip itinerary */
    public itineraryCounterInfo= {};
    public itineraryObject = {};
    public flightsList = [];
    public propertiesList = [];
    public cruisesList = [];
    public toursList = [];
    public trainsList = [];
    public carRentalsList = [];
    public groundTransferList = [];
    public allFlightActivitiesSummary = [];
    public allFlightActivitiesPDF = [];
    public itineraryValidationMessage = '';
    public isValidTripData = true;
    public isValidFlightData = true;
    public isValidPropertiesData = true;
    public isValidCruiseData = true;
    public isValidTourData = true;
    public isValidTrainData = true;
    public isValidCarData = true;
    public isValidGroundTransferData = true;
    public isSubmitButtonDisable = true;
    public tripId;
    public clientId;
    public isPrimary = '';

    public TODAY;
    public MINIMUMDATE;
    public MAXIMUMDATE;
    public pgList = {};
    public oldVal: any;
    public countInfo = {};
    public showBookingTab = false;
    public clientAge = '';

    public disableBtn = false;

    public bookings = [];
    public payments = [];
    public travellerIdEdit;

    public loadPayment=false;
    public loadActivity = false;
    public loadBooking = false;
    public loadInvoice = false;
    public loadTask = false;
    public loadDocuments = false;
    public loadNotes = false;
    
    @ViewChild('bookingInfoTab') bookingInfoTab: ElementRef;
    @ViewChild('bookingTab') bookingTab: ElementRef;
    constructor(
        public _route: ActivatedRoute,
        public _router: Router,
        public _commonAppService: CommonAppService,
        public _localStorageService: LocalStorageService,
        public _userService: UserService,
        public _tripService: TripService,
        public _itineraryService: ItineraryService,
        public _clientService: ClientService,
        public _viewContainerRef: ViewContainerRef,
        public _propertyService: PropertyService,
        public _cruiseService: CruiseService,
        public _bookingService: BookingService,
        public _eventsService: EventsService,
        public _googleCalendarEventsService: GoogleCalendarEventsService,
        public _flightActivityService: FlightActivity,
        public _roomService: RoomService,
        public _datePipe: DatePipe
    ) {

        this._commonAppService.getCurrentUserSession((user) => {
            this.currentUser = user;
            if (this._commonAppService.isUndefined(this.currentUser)) {
                window.location.href = '/login';
            } else {

                this.travelerObject = { "travelerId": "", "travelerType": "", "traveler": {} };
                this.tripObject = {
                    "_id": "",
                    "tripType": "Anniversary",
                    "startDate": this._commonAppService.getDateYYYYMMDD(new Date()),
                    "endDate": this._commonAppService.getDateYYYYMMDD(new Date()),
                    "agent": {
                        "agentFirstName": "",
                        "agentLastName": "",
                        "agentId": ""
                    },
                    "tripStatus": "Active",
                    "tripDescription": "",
                    "workspaceExtensions": [],
                    "travelerDetails": [],
                    "primary": {
                        "id": "",
                        "name": ""
                    }
                };

                this.itineraryObject = {
                    "_id": "",
                    "templateName": "",
                    "tripId": "",
                    "clientId": "",
                    "flights": [],
                    "properties": [],
                    "cruises": [],
                    "tours": [],
                    "trains": [],
                    "carRentals": [],
                    "groundTransfer": [],
                    "flightActivities": []
                }

                this.tripId = _route.snapshot.params['tripId'];
                this.clientId = _route.snapshot.params['clientId'];
                this.travelerTypeList = [{ "key": "primary", "value": "Primary" }, { "key": "secondary", "value": "Secondary" }];
                this.MINIMUMDATE = this._commonAppService.getDateYYYYMMDD(new Date());
            }
        });
    }

    spinnerConfig = {
        bdColor: '#333',
        size: 'large',
        color: '#fff'
    }

    public ngOnInit() {
        this.getTripOnPageLoad(this.tripId, this.clientId);
    }

    public getTripOnPageLoad(tripId, clientId) {
        let THIS = this;
        //  THIS._commonAppService.spinner.show();
        if (!THIS._commonAppService.isUndefined(clientId)) {
            THIS._clientService.getClientById(THIS.currentUser, clientId)
                .subscribe((data: any) => {
                    setTimeout(() => {
                        let _clientObject = data.result.client;
                        // THIS.travelerObject = { "travelerId": clientId, "travelerType": "primary", "traveler": _clientObject };
                        THIS.travelerObject = { "travelerId": clientId, "travelerType": "primary", "traveler":{} };
                        THIS.tripObject['travelerDetails'].push(THIS.travelerObject);
                    }, 0);
                },
                    (error: any) => {
                        console.log(' Error while getClientById :  ' + JSON.stringify(error));
                    });
        }
        if (!THIS._commonAppService.isUndefined(tripId)) {
            THIS.isTripEditMode = true;
            THIS.getEventOfTrip(tripId);
            THIS._tripService.getTripById(THIS.currentUser, tripId)
                .subscribe((data: any) => {
                    setTimeout(() => {
                        if (data && data.status == '0') {
                            window.location.href = '/dashboard';
                        } else {
                            // THIS.tripObject['travelerDetails'] = data.result.trip.travelerDetails;
                            THIS.tripNewTravelerList = (data.result.newTravelerDetails)? data.result.newTravelerDetails : [];

                            THIS.tripObject = data.result.trip;

                            THIS.tripNewTravelerList.forEach((element, i) => {
                                element.formattedBirthday = (!this._commonAppService.isUndefined(element.formattedBirthday))? this._commonAppService._getFormattedBirthday(element.formattedBirthday, this.tripObject.startDate, this.tripObject.endDate) : '';

                                element.formattedAnniversaryDate = (!this._commonAppService.isUndefined(element.formattedAnniversaryDate))? this._commonAppService._getFormattedAnniversaryDate(element.formattedAnniversaryDate, this.tripObject.startDate, this.tripObject.endDate) : '';
                            });

                            THIS.setTripAgent();
                            THIS.selectedAgent = THIS.tripObject['agent']['agentFirstName'] + " " + THIS.tripObject['agent']['agentLastName'];

                            THIS.getBookingInfomation();
                            THIS.setMaxDate();
                            THIS.setPageHeadingText();
                            THIS.getItinerariesByTripId(tripId);
                            this.isValidatedTripData();
                        }
                    }, 0);
                },
                (error: any) => {
                    console.log(' Error while getTripById :  ' + JSON.stringify(error));
                });
        }

        if (!this.isTripEditMode) {
            this.countInfo['bookings'] = 0;
            this.countInfo['payments'] = 0;
            this.countInfo['documents'] = 0;
            this.countInfo['notes'] = 0;
            this.countInfo['tasks'] = 0;
        }
        else
        {
            var counts = this._tripService.getCountInfo(this.currentUser , this.tripId)
            .subscribe((data:any) => {
                this.countInfo['bookings'] = data.result.bookingCount;
                this.countInfo['documents'] = data.result.docCount;
                this.countInfo['notes'] = data.result.noteCount;
                this.countInfo['tasks'] = data.result.taskCount;
                //console.log(data);
            }); 
        }
        this.getAgentList();
        //this.getClientList();
        this.getPropertyList();
        // THIS._commonAppService.spinner.hide();
    }


    public modelChanged(e) {
        if (e.length >= 2) {
            this.getClientList({ "search": e });
            this.travelerFlage = false;
        } else if (e.length < 2) {
            this.travelerFlage = true;
            this.clientsList = [];
            this.clientComplex = []
        }
    }
    public resetTravelers() {
        var _details = [];
        if (this.tripObject &&
            this.tripObject.travelerDetails &&
            this.tripObject.travelerDetails.length > 0) {
            for (var i = 0; i < this.tripObject.travelerDetails.length; i++) {
                var _detail = this._commonAppService.getTravelerById(
                    this.tripObject.travelerDetails[i].travelerId,
                    this.clientsList);
                if (_detail._id) {
                    this.tripObject.travelerDetails[i].traveler = _detail;
                }
            }
        }
    }

    public setTripAgent() {
        let THIS = this;
        THIS._userService.getUserById(THIS.currentUser, THIS.tripObject['agent']['agentId'])
            .subscribe((data: any) => {
                setTimeout(() => {

                    if (data && data.status == '0') {
                        // window.location.href = '/dashboard';
                    } else {
                        this.tripAgentObject = (data.result) ? data.result.user : {};
                        THIS.setMaxDate();
                        THIS.setPageHeadingText();
                        THIS.getItinerariesByTripId(THIS.tripObject._id);
                    }
                }, 0);
            },
                (error: any) => {
                    console.log(' Error while getUserById :  ' + JSON.stringify(error));
                });
    }


    public getItinerariesByTripId(tripId) {
        let THIS = this;

        THIS._itineraryService.getItineraryByTripId(THIS.currentUser, tripId)
            .subscribe((itineraryData: any) => {
                setTimeout(() => {
                    if (itineraryData.status == '1' && itineraryData.result.itinerary) {
                        THIS.itineraryObject = itineraryData.result.itinerary;

                        THIS.flightsList = THIS.getItineraryByKey('flights', THIS.itineraryObject['flights']);

                        THIS.propertiesList = THIS.getItineraryByKey('properties', THIS.itineraryObject['properties']);

                        THIS.cruisesList = THIS.getItineraryByKey('cruises', THIS.itineraryObject['cruises']);

                        THIS.toursList = THIS.getItineraryByKey('tours', THIS.itineraryObject['tours']);

                        THIS.trainsList = THIS.getItineraryByKey('trains', THIS.itineraryObject['trains']);

                        THIS.carRentalsList = THIS.getItineraryByKey('carRentals', THIS.itineraryObject['carRentals']);

                        THIS.groundTransferList = THIS.getItineraryByKey('groundTransfer', THIS.itineraryObject['groundTransfer']);

                        THIS.itineraryCounterInfo = {
                            "flight" : THIS.flightsList.length,
                            "property" : THIS.propertiesList.length,
                            "cruise" : THIS.cruisesList.length,
                            "tour" : THIS.toursList.length,
                            "train" : THIS.trainsList.length,
                            "car" : THIS.carRentalsList.length,
                            "ground" : THIS.groundTransferList.length
                        }
                    } else {
                        THIS.flightsList = THIS.getItineraryByKey('flights', []);

                        THIS.propertiesList = THIS.getItineraryByKey('properties', []);

                        THIS.cruisesList = THIS.getItineraryByKey('cruises', []);

                        THIS.toursList = THIS.getItineraryByKey('tours', []);

                        THIS.trainsList = THIS.getItineraryByKey('trains', []);

                        THIS.carRentalsList = THIS.getItineraryByKey('carRentals', []);

                        THIS.groundTransferList = THIS.getItineraryByKey('groundTransfer', []);
                    }

                    THIS.propertiesList.forEach((element, index) => {
                        if (THIS.propertiesList[index]['isPrimary'] == true) {
                            THIS.isPrimary = 'properties' + index;
                        }
                    });

                    THIS.cruisesList.forEach((element, index) => {
                        if (THIS.cruisesList[index]['isPrimary'] == true) {
                            THIS.isPrimary = 'cruise' + index;
                        }
                    });

                    if (THIS.isPrimary == '') {
                        if (THIS.propertiesList.length > 0) {
                            THIS.isPrimary = 'properties0';
                        } else if (THIS.cruisesList.length > 0) {
                            THIS.isPrimary = 'cruise0';
                        }
                    }

                    let tripActivityData = {
                        tripId: THIS.tripObject._id
                    };

                    //  THIS._flightActivityService.getAllTripActivity(THIS.currentUser, tripActivityData)
                    //     .subscribe((activityData: any) => {
                    //         if (activityData.status == '1') {
                    //             THIS.allFlightActivities = activityData.result.tripactivities;
                    //         } else {
                    //             THIS.allFlightActivities = [];
                    //         }
                    //     },
                    //     (error: any) => {
                    //         console.log(' Error while getAllTripActivity :  ' + JSON.stringify(error));
                    //     });
                }, 0);
            },
                (error: any) => {
                    console.log(' Error while getItineraryByTripId :  ' + JSON.stringify(error));
                });
    }

    public ngAfterViewInit() {
    }

    public onPDFAllFlightActivities(allFlightActivities) {

        this.allFlightActivitiesPDF = allFlightActivities;
        // this.allFlightActivitiesPDF = [];
    }

    public onSummaryAllFlightActivities(allFlightActivities) {

        this.allFlightActivitiesSummary = allFlightActivities;
        // this.allFlightActivitiesPDF = [];
    }

    public setMaxDate() {

        this.MAXIMUMDATE = this._commonAppService.getDateYYYYMMDD(this.tripObject['endDate']);
    }

    public setPageHeadingText() {
        if (!this._commonAppService.isUndefined(this.tripObject)) {
            try {
                this.tripPageHeadingText = " - " + this.tripObject.travelerDetails[0].traveler.firstName + " " +
                    this.tripObject.travelerDetails[0].traveler.lastName + " - ";
                this._tripStartDate = this.tripObject.startDate;
            }
            catch (e) {

            }
        }
    }

    public getAgentList() {
        let THIS = this;
        THIS._userService.getAllAgents(THIS.currentUser, {})
            .subscribe((data: any) => {

                if (data.status == '1') {
                    if (this.currentUser.user && this.currentUser.user.roleName != 'Agent' && this.currentUser.user.roleName != 'Assistant') {
                        THIS.agentsList = THIS.getAgentListOptions(data.result.users);
                        THIS.selectedAgent = '';
                    } else {
                        THIS.agentsList = data.result.users;
                        var _agentsList = THIS.agentsList.filter(item => item._id == this.currentUser.user._id);
                        THIS.agentsList = THIS.getAgentListOptions(_agentsList);
                        THIS.tripObject['agent'] = {
                            "agentId": this.currentUser.user._id,
                            "agentLastName": this.currentUser.user.firstName,
                            "agentFirstName": this.currentUser.user.lastName
                        };
                        THIS.selectedAgent = this.currentUser.user.firstName + " " + this.currentUser.user.lastName;
                    }
                } else {
                    THIS.agentsList = [];
                }
                // THIS.getClientList();
            },
                (error: any) => {
                    console.log(' Error while getAllAgents :  ' + JSON.stringify(error));
                });

    }

    public getAgentListOptions(users) {
        var agentList = [];
        for (var i = 0; i < users.length; i++) {
            agentList.push({
                name: users[i].firstName + " " + users[i].lastName,
                _id: users[i]._id,
                firstName: users[i].firstName,
                lastName: users[i].lastName
            })
        }
        return agentList;
    }

    public getClientList(search) {
        let THIS = this;
        search.userId = THIS.tripAgentObject['_id'];
        THIS._clientService.getAllClients(THIS.currentUser, search)
            .subscribe((data: any) => {
                if (data.status == '1') {
                    THIS.clientsList = THIS.filteredClientsList = data.result.clients;
                    let clientData = {};
                    this.clientComplex = [];
                    for (let i = 0; i < this.clientsList.length; i++) {
                        clientData['name'] = this.clientsList[i].firstName + " " + this.clientsList[i].lastName;
                        clientData['_id'] = this.clientsList[i]._id;
                        this.clientComplex.push({
                            name: clientData['name'],
                            _id: clientData['_id'],
                        });

                    }
                    THIS.resetTravelers();
                    THIS.checkPrimary();
                } else {
                    THIS.clientsList = [];
                }
                // THIS.getPropertyList();
            },
                (error: any) => {
                    console.log(' Error while getAllClients :  ' + JSON.stringify(error));
                });
    }

    public agentSelectChange(e) {
        let id = e.item._id;
        let agent = this.agentsList.find(i => i._id == id);

        this.tripObject['agent'] = {
            "agentId": agent._id,
            "agentLastName": agent.firstName,
            "agentFirstName": agent.lastName
        }
        this.isValidatedTripData();
    }

    public isValidatedData() {
        if (this.isValidTripData && this.isValidFlightData &&
            this.isValidPropertiesData &&
            this.isValidCruiseData &&
            this.isValidTourData &&
            this.isValidTrainData &&
            this.isValidCarData &&
            this.isValidGroundTransferData) {
            return true;
        }
        else if(!(this.isValidFlightData)||!(this.isValidPropertiesData)||!(this.isValidCruiseData)||!(this.isValidTourData)||!(this.isValidTrainData)||!(this.isValidCarData)||!(this.isValidGroundTransferData)){
            this._commonAppService.showErrorMessage('Alert', 'Failed to update Trip! \n Please select date between trip start and end dates.', function (alertRes) {
            });
            return false;
        }
        else {
            this._commonAppService.showErrorMessage('Alert', 'Failed to update Trip! \n Please fill all values for itinerary.', function (alertRes) {
            });
            return false;
        }
    }
    public isValidatedTripData() {

        if (this._commonAppService.isUndefined(this.tripObject['tripType']) || this._commonAppService.isUndefined(this.tripObject['startDate']) || this._commonAppService.isUndefined(this.tripObject['endDate']) || this._commonAppService.isUndefined(this.tripObject['agent'].agentId)) {
            this._commonAppService.showErrorMessage('Alert', this._commonAppService.requiredFieldMessage, (alertRes) => {
                this.isSubmitButtonDisable = true;
                return false;
            });
        } else if (this.tripObject['startDate'] > this.tripObject['endDate']) {
            this._commonAppService.showErrorMessage('Alert', 'Start date must before end date', (alertRes) => {
            });
            this.isSubmitButtonDisable = true;
            return false;
        }
        else {
            this.isSubmitButtonDisable = false;
            return true;
        }
    }
    public checkTrip(flag, itineraryType) {
        let check = false;
        if (itineraryType == GlobalVariable.ITINERARY_TYPE.PROPERTIES) {
            for (var i = 0; i < this.propertiesList.length; i++) {
                check = false;
                if (this.propertiesList[i].checkInDate > this.propertiesList[i].checkOutDate) {
                    this._commonAppService.showErrorMessage('Alert', 'Check Out date for ' + itineraryType + ' entry ' + (i + 1) + ' must be after check In date', (alertRes) => {
                    });
                }
                else if (this.propertiesList[i].checkInDate == this.propertiesList[i].checkOutDate) {
                    if (this.propertiesList[i].checkInTime > this.propertiesList[i].checkOutTime) {
                        this._commonAppService.showErrorMessage('Alert', 'Check Out time for ' + itineraryType + ' entry ' + (i + 1) + ' must be after check In time', (alertRes) => {
                        });
                    }
                    else {
                        check = true;
                    }
                }
                else {
                    check = true;
                }

            }
            if (check) {
                this.saveTrip(false, false);
            }
        }
        else if (itineraryType == GlobalVariable.ITINERARY_TYPE.TRAIN) {
            for (var i = 0; i < this.trainsList.length; i++) {
                check = false;
                if (this.trainsList[i].departureDate > this.trainsList[i].estimatedArrivalDate) {
                    this._commonAppService.showErrorMessage('Alert', 'Arrival Date for ' + itineraryType + ' entry ' + (i + 1) + ' must be after Departure Date', (alertRes) => {
                    });
                }
                else if (this.trainsList[i].departureDate == this.trainsList[i].estimatedArrivalDate) {
                    if (this.trainsList[i].departureTime > this.trainsList[i].estimatedArrivalTime) {
                        this._commonAppService.showErrorMessage('Alert', 'Arrival time for ' + itineraryType + ' entry ' + (i + 1) + ' must be after Departure time', (alertRes) => {
                        });
                    }
                    else {
                        check = true;
                    }
                }
                else {
                    check = true;
                }

            }
            if (check) {
                this.saveTrip(false, false);
            }
        }
        else if (itineraryType == GlobalVariable.ITINERARY_TYPE.CRUISE) {
            for (var i = 0; i < this.cruisesList.length; i++) {
                check = false;
                if (this.cruisesList[i].departureDate > this.cruisesList[i].arrivalDate) {
                    this._commonAppService.showErrorMessage('Alert', 'Arrival Date for entry ' + (i + 1) + ' must be after Departure Date', (alertRes) => {
                    });
                }
                else if (this.cruisesList[i].departureDate == this.cruisesList[i].arrivalDate) {
                    if (this.cruisesList[i].departureTime > this.cruisesList[i].arrivalTime) {
                        this._commonAppService.showErrorMessage('Alert', 'Arrival time for ' + itineraryType + ' entry ' + (i + 1) + ' must be after Departure time', (alertRes) => {
                        });
                    }
                    else {
                        check = true;
                    }
                }
                else {
                    check = true;
                }

            }
            if (check) {
                this.saveTrip(false, false);
            }
        }
    }
    public tripModeCheckAndSave(e:any,flag) {

       e.target.disabled = true;
       console.log(flag);
        if (this.clientId) {
            this._clientService.increaseTripCounterByClientId(this.currentUser, this.clientId)
                .subscribe((data: any) => {
                    setTimeout(() => {
                        if (data && data.status == '0') {
                            console.log("Failed to increase the trip counter");
                        }
                        else {
                            console.log("Successfully increased Trip counter for " + this.clientId);
                        }
                    },
                        (error: any) => {
                            console.log('error occured while calling the api');
                        });
                });
            this.saveTrip(false, false);
            console.log('if part');
        } else {
            if(flag===true){
                this.saveTrip(true,false);
            }else {
                this.saveTrip(false,false);
            }
        }
        

    }

    public saveTrip(flag, isTravelerUpdate) {

        let THIS = this;
        if (!THIS.isValidatedData()) {
            return;
        }
        if (!THIS.isValidatedTripData()) {
            return;
        }
        else {
        this.itineraryObject = {
            "_id": this.itineraryObject['_id'],
            "templateName": "Test template",
            "tripId": this.tripObject['_id'],
            "clientId": (this.tripObject['travelerDetails'][0]) ? this.tripObject['travelerDetails'][0].travelerId : "",
            "flights": this.flightsList,
            "properties": this.propertiesList,
            "cruises": this.cruisesList,
            "tours": this.toursList,
            "trains": this.trainsList,
            "carRentals": this.carRentalsList,
            "groundTransfer": this.groundTransferList
        }

        let allArray = [];
        allArray.push(this.flightsList);
        allArray.push(this.propertiesList);
        allArray.push(this.cruisesList);
        allArray.push(this.toursList);
        allArray.push(this.trainsList);
        allArray.push(this.carRentalsList);
        allArray.push(this.groundTransferList);
        THIS._commonAppService.checkItineraryDetails(allArray,  (err, isValid) => {
            if(isValid){
                THIS.setPrimaryClient((tripObject) => {
                    THIS._tripService.addUpdateTrip(THIS.currentUser, THIS.tripObject, THIS.tripObject['_id'])
                        .subscribe((data: any) => {
                            if (isTravelerUpdate) {
                                this.getTripOnPageLoad(this.tripId, this.clientId);
                            }
                            this.clearTraverler();
                            if (data.status == '1') {
                                THIS._commonAppService.showSuccessMessage('Alert', data.result.message, function (alertRes) { });
    
                                let startDate = new Date(this.tripObject.startDate).getTime();
                                let endDate = new Date(this.tripObject.endDate).getTime() + 86400000;
                                this.addEditGoogleCalendarEvent(startDate, endDate, this.tripObject.tripDescription, this.tripObject.tripDescription, this.tripEvent, (googleErr, googleCalendarEventId) => {

                                    let eventObject = {
                                        '_id': (THIS.tripEvent) ? THIS.tripEvent._id : '',
                                        'startDate': new Date(THIS.tripObject.startDate).getTime(),
                                        'endDate': new Date(THIS.tripObject.endDate).getTime(),
                                        'type': 'trip',
                                        'title': THIS.tripObject.tripDescription,
                                        'status': 'Active',
                                        'agentId': this.tripObject.agent['agentId'],
                                        'taskId': '',
                                        'tripId': THIS.tripObject['_id'] == '' ? data.result._id : THIS.tripId,
                                        'googleCalendarEventId': googleCalendarEventId
                                    };

                                    THIS._eventsService.addEditEvent(THIS.currentUser, eventObject, eventObject._id != '')
                                    .subscribe((eventData: any) => {
                                        THIS.getEventOfTrip(THIS.tripObject['_id']);
                                        if (eventData.status == '1') {
                                            if (THIS.tripObject['_id'] == '') {
                                                THIS.tripObject['_id'] = data.result._id;
                                                THIS._router.navigate(['trip/editTrip/' + data.result._id]);
                                            }
    
                                            THIS.setTripAgent();
                                            if (THIS.tripObject['_id'] != '' && THIS.isTripEditMode == true) {
                                                THIS.saveItinerary(flag, allArray);
                                                THIS.tripObject['_id'] = data.result._id;
                                                THIS._router.navigate(['trip/editTrip/' + data.result._id]);
                                            } else if (flag == true) {
                                                THIS.closePage();
                                            }
                                        }
                                        else {
                                            if (THIS.tripObject['_id'] == '') {
                                                THIS.tripObject['_id'] = data.result._id;
                                                THIS._router.navigate(['trip/editTrip/' + data.result._id]);
                                            }
                                        }
                                    },
                                    (error: any) => {
                                        THIS._commonAppService.showErrorMessage('Alert', error, function (alertRes) { });
                                        if (flag == true) {
                                            THIS.closePage();
                                        }
                                    });
                                });
    
                            } else {
                                THIS._commonAppService.showErrorMessage('Alert', data.result.message, function (alertRes) { });
                            }
                        },
                        (error: any) => {
                            THIS._commonAppService.showErrorMessage('Alert', error, function (alertRes) { });
                            if (flag == true) {
                                THIS.closePage();
                            }
                        });
                });
            } else {
                THIS._commonAppService.showErrorMessage('Alert', err, function (alertRes) { });
            }
        });

            
        }
    }


    public addEditGoogleCalendarEvent(startDate, endDate, subject, description, editEventObject, callback) {
        let googleEventObject = {
            'startDate': startDate,
            'endDate': endDate,
            'title': subject,
            'description': description,
            'googleCalendarEventId': (editEventObject) ? editEventObject.googleCalendarEventId : "",
            "type": "trip",
            "reminders": []
        };

        this._googleCalendarEventsService.addEditGoogleCalendarEvent(this.currentUser, googleEventObject, !this._commonAppService.isUndefined(googleEventObject.googleCalendarEventId))
            .subscribe((data: any) => {
                if (data.status == '1') {
                    callback(null, data.result.event.id);
                } else {
                    callback(data.result.err, "");
                }
            },
            (error: any) => {
                this._commonAppService.showErrorMessage('Alert', error, function (alertRes) { });
            });
    }

    public setPrimaryClient(callback) {
        // THIS.tripObject.primary = { "id": "", "name": ""};

        let traveler = this.tripObject.travelerDetails[0];
        if (traveler && traveler.travelerType === "primary") {
            // THIS.tripObject.primary = {
            //     "id": traveler.traveler._id,
            //     "name": traveler.traveler.firstName
            // };
            callback(this.tripObject);
        } else {
            callback(this.tripObject);
        }

    }

    public AddNewTraveler() {
        this.isAddTraveler = true;
        this.isTravelerEditMode = false;
        this.newClientName = "";
    }

    public addTraveler() {


        var isTravelerExist = false;
        if (this._commonAppService.isUndefined(this.travelerObject['travelerType']) || this._commonAppService.isUndefined(this.travelerObject['travelerId'])) {
            this._commonAppService.showErrorMessage('Alert', 'Please select type and traveler', function (alertRes) { });
        } else {
            let travelerId = "";
            let travelerType = "";

            if (this.isTravelerEditMode == false) {
                travelerId = this.travelerObject['travelerId'];
                travelerType = this.travelerObject['travelerType'];
            } else {
                travelerId = this.selectedEditTraveler.travelerId;
                travelerType = this.selectedEditTraveler.travelerType;
            }

            this.travelerObject["traveler"] = this.clientsList.filter((client) => {
                return client._id === this.travelerObject["travelerId"];
            });//add lead guest
       


            console.log("this.travelerObject.travelerId : " + JSON.stringify(this.travelerObject));
            //console.log("this.selectedEditTraveler " + JSON.stringify(this.selectedEditTraveler));
            if (this.tripNewTravelerList != undefined && this.tripNewTravelerList != []) {
                this.tripNewTravelerList.forEach((element, index) => {
                    if (element.travelerId == travelerId && element.travelerType == travelerType) {
                        isTravelerExist = true;
                    }
                });
            } else {
                isTravelerExist = false;
            }

            if (!isTravelerExist && !this.isTravelerEditMode) {
                
                
                // this.travelerObject["traveler"] = this.travelerObject["traveler"][0];
                this.tripObject['travelerDetails'].push({
                    travelerId: this.travelerObject['travelerId'],
                    travelerType: this.travelerObject['travelerType']
                });

                if (this.isTravelerEditMode == false) {
                    // this.tripObject['travelerDetails'].push(this.travelerObject);
                }
                // this.isTravelerEditMode = false;

                this.checkPrimary();
                this._clientService.increaseTripCounterByClientId(this.currentUser, this.travelerObject["travelerId"])
                    .subscribe((data: any) => {
                        setTimeout(() => {
                            if (data && data.status == '0') {
                                console.log("Failed to increase the trip counter");
                            }
                            else {
                                console.log("Successfully increased Trip counter for " + this.travelerObject["travelerId"]);
                            }
                        },
                            (error: any) => {
                                console.log('error occured while calling the api');
                            });
                    });

                console.log(' 1this.tripObject ' + JSON.stringify(this.tripObject));

                this.saveTrip(false, true);

                this.travelerObject = { "travelerId": "", "travelerType": "", "traveler": {} };

            } else if (!isTravelerExist && this.isTravelerEditMode) {
                
                this.tripObject['travelerDetails'] = this.tripNewTravelerList;

                this._clientService.decreaseTripCountersByClientIds(this.currentUser, this.travellerIdEdit)
                    .subscribe((data: any) => {
                        setTimeout(() => {
                            if (data && data.status == '0') {
                                console.log("Failed to decrease the trip counter");
                            }
                            else {
                                console.log("Successfully decreased Trip counter for " + this.travellerIdEdit);
                            }
                        },
                        (error: any) => {
                            console.log('error occured while calling the api');
                        });
                    });

                this._clientService.increaseTripCounterByClientId(this.currentUser, this.travelerObject["travelerId"])
                    .subscribe((data: any) => {
                        setTimeout(() => {
                            if (data && data.status == '0') {
                                console.log("Failed to increase the trip counter");
                            }
                            else {
                                console.log("Successfully increased Trip counter for " + this.travelerObject["travelerId"]);
                            }
                        },
                            (error: any) => {
                                console.log('error occured while calling the api');
                            });
                    });

                console.log(' 2this.tripObject ' + JSON.stringify(this.tripObject));
                this.saveTrip(false, true);
            } else {
                this._commonAppService.showErrorMessage('Alert', "Traveler already added to this trip.", function (alertRes) { });
            }
        }
    }

    public clearTraverler() {
        this.isAddTraveler = false;
        this.isTravelerEditMode = false;
        this.newClientName = "";

        this.travelerObject = { "travelerId": "", "travelerType": "", "traveler": {} };
    }

    public closePage() {
        this._router.navigate(['trips']);
    }

    public checkPrimary() {
        let THIS = this;
        THIS.travelerTypeList = [{ "key": "primary", "value": "Primary" }, { "key": "secondary", "value": "Secondary" }];
        if (THIS.tripObject['travelerDetails'] && THIS.tripObject['travelerDetails'].length > 0) {
            THIS.tripObject['travelerDetails'].forEach((element, index) => {

                //  if (element.travelerType == 'primary' && THIS.travelerTypeList.length == 2) {
                //     THIS.travelerTypeList.splice(0, 1);
                // }
                THIS.filteredClientsList = THIS.filteredClientsList.filter(x => x._id != element.travelerId);
                try {
                    // var ss= THIS.clientsList.filter(x => x._id =='5ad9d3a0f404282724155304');
                    THIS.contactDetails = element.traveler.contactDetails.filter(x => x.detail == 'Email Address');
                    if (THIS.contactDetails.length > 0) {
                        element.traveler["EmailAddress"] = THIS.contactDetails[0].value;
                        element.traveler["emailCount"] = THIS.contactDetails.length;
                    }
                } catch (e) { }

                // element.traveler["EmailAddress"]= element.traveler.contactDetails[0].value;
                if (element.traveler != undefined) {
                    var birthDate = THIS.GetFormattedBirthday(element.traveler.birthDate);
                    element.traveler["formattedBirthday"] = birthDate;
                    if (birthDate == "") {
                        element.traveler["isFormattedBirthday"] = false;
                    }
                    var anniversaryDate = THIS.GetFormattedAnniversaryDate(element.traveler.anniversaryDate);
                    element.traveler["formattedAnniversaryDate"] = anniversaryDate;
                }
                else {
                    //THIS.tripObject['travelerDetails'] = null;
                    var traveler = { "EmailAddress": "", "emailCount": 0, "formattedBirthday": "", "formattedAnniversaryDate": "" };
                    element.traveler = traveler;
                }

                THIS.totalRecords = THIS.filteredClientsList.length;
                let _pList = THIS._commonAppService.getPagerList(THIS.totalRecords, THIS.limit, THIS.pageCount);
                THIS.pgList = (_pList) ? _pList : [];
            });
            THIS.getPagginationList(THIS.currentPageCount, THIS.limit);
        }
    }

    public removeTraveler(traveler, i) {
        var travelerID;
       // console.log('Check traveler'+JSON.stringify(traveler)+'i'+i)

        this._commonAppService.showConfirmDialog(this._commonAppService.removeConfirmMessage, (confirmRes) => {
            if (confirmRes == true) {

                if (this.tripObject['travelerDetails'] && this.tripObject['travelerDetails'].length > 0) {

                    // let index: number = this.tripObject['travelerDetails'].indexOf(traveler.travelerId);
                    let index: number = i;
                    travelerID = traveler.travelerId;
                    if (travelerID && travelerID != '') {
                        this.tripObject['travelerDetails'] = this.tripObject['travelerDetails'].filter(( obj ) => {
                            return obj.travelerId !== travelerID;
                          });
                       // this.tripObject['travelerDetails'].splice(index, 1);
                        this._clientService.decreaseTripCountersByClientIds(this.currentUser, travelerID)
                            .subscribe((data: any) => {
                                setTimeout(() => {
                                    if (data && data.status == '0') {
                                        console.log("Failed to decrease the trip counter");
                                    }
                                    else {
                                        console.log("Successfully decreased Trip counter for " + travelerID);
                                    }
                                },
                                    (error: any) => {
                                        console.log('error occured while calling the api');
                                    });
                            });

                        this.saveTrip(false, true);
                        this.filteredClientsList.push(this.clientsList.filter(x => x._id == traveler.travelerId)[0]);
                        this.checkPrimary();
                    }
                }

            }
        });

    }
   

    public editTraveler(traveler) {

        this.isAddTraveler = true;
        this.isTravelerEditMode = true;

        this.newClientName = traveler['firstName'] + " " + traveler['lastName'];
        // if (traveler['travelerType'] == 'primary') {
        //     this.travelerTypeList = [{ "key": "primary", "value": "Primary" }, { "key": "secondary", "value": "Secondary" }];
        // }
        var travelerID= traveler['travelerId'];
        this.travellerIdEdit=traveler['travelerId'];
        
        let index: number = this.tripNewTravelerList.indexOf(traveler);

        if (index !== -1) {
            //  this.filteredClientsList.push(traveler['traveler']);
        }
        this.selectedEditTraveler = Object.assign({}, traveler);

        this.travelerObject = traveler;

    }

    public getPagginationList(count, limit) {

        this.travelerDetailsList = this._commonAppService.getPaginatedItems(this.tripObject['travelerDetails'], count, limit);
    }


    /* Trip itinerary */

    public radioChange(index, type) {


        this.isPrimary = type + index;
        this.changePrimaryItinerary(index, type);
    }

    public checkIsPrimary(index, type) {

        return (this.isPrimary == (type + index));
    }

    public changePrimaryItinerary(index, type) {

        let allArray = [];
        allArray.push(this.propertiesList);
        allArray.push(this.cruisesList);

        allArray.forEach((array, index) => {
            array.forEach(element => {
                if (element['isPrimary']) {
                    element['isPrimary'] = false;
                }
            });
        });

        if (type == 'properties') {
            this.propertiesList[index]['isPrimary'] = true;
            this.allPropertyList.forEach(prop => {
                if (this.propertiesList[index] && prop._id == this.propertiesList[index].propertyId) {
                    this.tripObject.primary = {
                        "id": prop._id,
                        "name": prop.name
                    };
                }
            });
        } else if (type == 'cruise') {
            this.cruisesList[index]['isPrimary'] = true;
            this.allCruiseItinerariesTitleList.forEach(cruiseIti => {
                if (this.cruisesList[index] && cruiseIti._id == this.cruisesList[index].cruiseItineraryId) {
                    this.tripObject.primary = {
                        "id": cruiseIti._id,
                        "name": cruiseIti.title
                    };
                }
            });
        }
    }

    public newFlight() {
        this.isValidFlightData = false;
        let _tempflights = this.flightsList;
        _tempflights.push({ "departureDate": new Date(), "departureTime": null, "flightNumber": "", "isPrimary": false });
        this.flightsList = _tempflights;
    }

    public removeFlight(index) {

        this.flightsList.splice(index, 1);
            this.isValidFlightData = true;
            if(this.flightsList.length < this.itineraryCounterInfo['flight']){
                this._commonAppService.showErrorMessage('Alert', 'You removed a Flight itinerary, Please click save.', function (alertRes) { });
            }
    }

    public newProperty() {

        let _tempProperty = this.propertiesList;
        _tempProperty.push({ "checkInDate": null, "checkInTime": null, "checkOutDate": null, "checkOutTime": null, "propertyId": "", "isPrimary": false, "roomCategories": [] });
        this.propertiesList = _tempProperty;

    }

    public removeProperty(index) {

        this.propertiesList.splice(index, 1);
            this.isValidPropertiesData = true;
            if(this.propertiesList.length < this.itineraryCounterInfo['property']){
                this._commonAppService.showErrorMessage('Alert', 'You removed a Resort/Hotel itinerary, Please click save.', function (alertRes) { });
            }
    }

    public newRoomCategory(index, type) {
        let THIS = this;

        if (type == 'property') {
            THIS._commonAppService.validateObject(THIS.propertiesList, function (err, isValid) {
                if (err || isValid == false) {
                    THIS._commonAppService.showErrorMessage('Alert', err, function (alertRes) { });
                } else {
                    let _tempRoom = THIS.propertiesList[index]['roomCategories'];
                    _tempRoom.push({ "checkInDate": THIS.propertiesList[index].checkInDate, "checkOutDate": THIS.propertiesList[index].checkOutDate, "roomId": "", "roomNumber": "" });
                    THIS.propertiesList[index]['roomCategories'] = _tempRoom;
                }
            });
        } else if (type == 'cruise') {

            THIS._commonAppService.validateObject(THIS.cruisesList, (err, isValid) => {
                if (err || isValid == false) {
                    THIS._commonAppService.showErrorMessage('Alert', err, function (alertRes) { });
                } else {
                    let _tempRoom = THIS.cruisesList[index]['roomCategories'];
                    _tempRoom.push({ "checkInDate": THIS.cruisesList[index].departureDate, "checkOutDate": THIS.cruisesList[index].arrivalDate, "roomId": "", "roomNumber": "" });
                    THIS.cruisesList[index]['roomCategories'] = _tempRoom;
                }
            });
        }
    }

    public removeRoomCategory(index1, index2, type) {
        if (type == 'property') {
            this.propertiesList[index1]['roomCategories'].splice(index2, 1);
        } else if (type == 'cruise') {
            this.cruisesList[index1]['roomCategories'].splice(index2, 1);
        }
    }

    public newCruise() {
        let _tempCruise = this.cruisesList;
        _tempCruise.push({ "departureDate": null, "departureTime": null, "arrivalDate": null, "arrivalTime": null, "cruiseItineraryId": "", "isPrimary": false, "roomCategories": [], "cruiseId": "" });
        this.cruisesList = _tempCruise;
    }

    public removeCruise(index) {
        this.cruisesList.splice(index, 1);
            this.isValidCruiseData = true;
            if(this.cruisesList.length < this.itineraryCounterInfo['cruise']){
                this._commonAppService.showErrorMessage('Alert', 'You removed a cruise itinerary, Please click save.', function (alertRes) { });
            }
    }

    public newTour() {
        let _tempTour = this.toursList;
        _tempTour.push({ "checkInDate": new Date(), "checkInTime": null, "tourName": "" });
        this.toursList = _tempTour;
    }

    public removeTour(index) {
        this.toursList.splice(index, 1);
            this.isValidTourData = true;
            if(this.toursList.length < this.itineraryCounterInfo['tour']){
                this._commonAppService.showErrorMessage('Alert', 'You removed a tour itinerary, Please click save.', function (alertRes) { });
            }
    }

    public newTrain() {

        let _tempTrain = this.trainsList;
        _tempTrain.push({ "departureDate": null, "departureTime": null, "estimatedArrivalDate": null, "estimatedArrivalTime": null, "trainName": "", "coachNo": "", "seatNo": "" });
        this.trainsList = _tempTrain;
    }

    public removeTrain(index) {

        this.trainsList.splice(index, 1);
            this.isValidTrainData = true;
            if(this.trainsList.length < this.itineraryCounterInfo['train']){
                this._commonAppService.showErrorMessage('Alert', 'You removed a train itinerary, Please click save.', function (alertRes) { });
            }
    }

    public newCar() {

        let _tempCar = this.carRentalsList;
        _tempCar.push({ "departureDate": new Date(), "departureTime": new Date(), "location": "" });
        this.carRentalsList = _tempCar;
    }

    public removeCar(index) {

        this.carRentalsList.splice(index, 1);
            this.isValidCarData = true;
            if(this.carRentalsList.length < this.itineraryCounterInfo['car']){
                this._commonAppService.showErrorMessage('Alert', 'You removed a car itinerary, Please click save.', function (alertRes) { });
            }
    }

    public newGroundTransfer() {

        let _tempGround = this.groundTransferList;
        _tempGround.push({ "departureDate": new Date(), "departureTime": new Date(), "location": "" });
        this.groundTransferList = _tempGround;
    }

    public removeGroundTransfer(index) {

        this.groundTransferList.splice(index, 1);
            this.isValidGroundTransferData = true;
            if(this.groundTransferList.length < this.itineraryCounterInfo['ground']){
                this._commonAppService.showErrorMessage('Alert', 'You removed a ground transfer itinerary, Please click save.', function (alertRes) { });
            }
    }

    public validateDateValue(valueType, oldObject, oldValue, date, time, type, index, subCategoryIndex, itineraryTypeIndex) {

        this.itineraryValidationMessage = '';
        let _TIME = this._commonAppService.getFormattedTime(time);
        let checkDate = this._commonAppService.getAsDate(date, (_TIME == null || _TIME == '') ? '00:00' : _TIME);
        let isValid = true;
        let _tripStartDate = this._commonAppService.getAsDate(this.tripObject['startDate'], '00:00');
        let _tripEndDate = this._commonAppService.getAsDate(this.tripObject['endDate'], '23:59');
        if (checkDate >= _tripStartDate && checkDate <= _tripEndDate) {
            let allArray = [];
            allArray.push(this.flightsList);
            allArray.push(this.propertiesList);
            allArray.push(this.cruisesList);
            allArray.push(this.toursList);
            allArray.push(this.trainsList);
            allArray.push(this.carRentalsList);
            allArray.push(this.groundTransferList);
            allArray.forEach((array, mainIndex) => {
                array.forEach((element, subIndex) => {
                    if (itineraryTypeIndex == mainIndex && index == subIndex) {
                    } else {
                        for (const k in element) {
                            if (k != 'isPrimary' && !this._commonAppService.isUndefined(element)) {
                                let _fromDate = (element.departureDate) ? element.departureDate : element.checkInDate;
                                let _toDate = (element.departureDate) ? element.departureDate : element.checkOutDate;
                                let _fromTime = (element.departureTime) ? element.departureTime : (element.checkInTime) ? element.checkInTime : "00:00";
                                let _toTime = (element.departureTime) ? element.departureTime : (element.checkOutTime) ? element.checkOutTime : '00:00';
                                let _fromCheckDate = this._commonAppService.getAsDate(_fromDate, _fromTime);
                                let _toCheckDate = this._commonAppService.getAsDate(_toDate, _toTime);
                                if (checkDate >= _fromCheckDate && checkDate <= _toCheckDate) {
                                    isValid = false;
                                }
                            }
                        }
                    }
                });
                if ((mainIndex == (allArray.length - 1)) && (isValid == false)) {
                    this.showValidationMessage('Some other itinerary already book for this date');
                    if (type == 'properties') {
                        this.isValidPropertiesData = false;
                    } else if (type == 'cruise') {
                        this.isValidCruiseData = false;
                    } else if (type == 'train') {
                        this.isValidTrainData = false;
                    }
                } else if ((mainIndex == (allArray.length - 1)) && (isValid == true)) {
                    if (type == 'properties') {
                        this.isValidPropertiesData = true;
                    } else if (type == 'cruise') {
                        this.isValidCruiseData = true;
                    } else if (type == 'train') {
                        this.isValidTrainData = true;
                    }
                }
            });
        } else {
            // if(type == 'flights'){

            //     let _tempObject =  oldObject;
            //     if(valueType == 'date'){
            //         _tempObject['departureDate'] = oldValue;
            //     } else {
            //         _tempObject['departureTime'] = oldValue;
            //     }

            //     this.flightsList.splice(index, 1);

            //     let _tempflights = this.flightsList;

            //     _tempflights.push(_tempObject);

            //     this.flightsList = _tempflights;

            // } else if(type == 'properties'){
            //     let _tempObject = oldObject;

            //     if(valueType == 'date'){
            //         _tempObject['checkInDate'] = null;
            //     } else {
            //         _tempObject['checkInTime'] = null;
            //     }

            //     this.propertiesList.splice(index, 1);

            //     let _tempProperty= this.propertiesList;

            //     _tempProperty.push(_tempObject);

            //     this.propertiesList = _tempProperty;

            // } else if(type == 'cruise'){

            //     let _tempObject = oldObject;

            //     if(valueType == 'date'){
            //         _tempObject['departureDate'] = oldValue;
            //     } else {
            //         _tempObject['departureTime'] = oldValue;
            //     }

            //     this.cruisesList.splice(index, 1);

            //     let _tempcruise= this.cruisesList;

            //     _tempcruise.push(_tempObject);

            //     this.cruisesList = _tempcruise;

            // } else if(type == 'tour'){

            //     let _tempObject = oldObject;

            //     if(valueType == 'date'){
            //         _tempObject['checkInDate'] = oldValue;
            //     } else {
            //         _tempObject['checkInTime'] = oldValue;
            //     }

            //     this.toursList.splice(index, 1);

            //     let _temptour= this.toursList;

            //     _temptour.push(_tempObject);

            //     this.toursList = _temptour;

            // }  else if(type == 'train'){

            //     let _tempObject = oldObject;

            //     if(valueType == 'date'){
            //         _tempObject['departureDate'] = oldValue;
            //     } else {
            //         _tempObject['departureTime'] = oldValue;
            //     }

            //     this.trainsList.splice(index, 1);

            //     let _temptrain= this.trainsList;

            //     _temptrain.push(_tempObject);

            //     this.trainsList = _temptrain;

            // } else if(type == 'car'){

            //     let _tempObject = oldObject;

            //     if(valueType == 'date'){
            //         _tempObject['departureDate'] = oldValue;
            //     } else {
            //         _tempObject['departureTime'] = oldValue;
            //     }

            //     this.carRentalsList.splice(index, 1);

            //     let _tempcar= this.carRentalsList;

            //     _tempcar.push(_tempObject);

            //     this.carRentalsList = _tempcar;

            // } else if(type == 'ground'){

            //     let _tempObject = oldObject;

            //     if(valueType == 'date'){
            //         _tempObject['departureDate'] = oldValue;
            //     } else {
            //         _tempObject['departureTime'] = oldValue;
            //     }

            //     this.groundTransferList.splice(index, 1);

            //     let _tempground= this.groundTransferList;

            //     _tempground.push(_tempObject);

            //     this.groundTransferList = _tempground;

            // }

            // this.resetItineraryValidationMessage('Date should be between start and end date.');
            // alert('Date should be between start and end date.');
        }
    }

    public validateTripStartEndDate(oldObject, startDate, endDate, type) {

        this.TODAY = this._commonAppService.getCurrentDate();
        if (startDate >= this.TODAY) {
            if (startDate > endDate) {
                // this.showValidationMessage('Trip start date can not be after trip end date');
                this.showValidationMessage('Invalid Trip End Date');
                if (type == 'start') {
                    this.tripObject['startDate'] = oldObject['startDate'];
                } else if (type == 'end') {
                    this.tripObject['endDate'] = oldObject['endDate'];
                }
                this.setMaxDate();
                this.isSubmitButtonDisable = true;
            }
            else {
                this.isSubmitButtonDisable = false;
                this.isValidTripData = true;
            }
        }
        else {
            this.showValidationMessage('Trip start date must be a today or any future date');
            this.isValidTripData = false;
            return false;
        }
    }

    public validateFlightDates(valueType, oldObject, oldValue, date, time, type, index, subCategoryIndex, itineraryTypeIndex) {
        if (!this._commonAppService.isUndefined(date)) {
            this.validateDateWithStartDateEndDate(valueType, oldObject, oldValue, date, time, type, index, subCategoryIndex, itineraryTypeIndex, (isValid) => {
                if (!isValid) {
                    this.resetItineraryValidationMessage('Date should be between trip start and end date.');
                    this.isValidFlightData = false;
                }
                else {
                    this.isValidFlightData = true;
                }
            });
        }
        /* else
        {
            this.isValidFlightData = true; 
        } */
    }

    public validatePropertyDates(valueType, oldObject, oldValue, date, time, type, index, subCategoryIndex, itineraryTypeIndex) {

        this.validateDateWithStartDateEndDate(valueType, oldObject, oldValue, date, time, type, index, subCategoryIndex, itineraryTypeIndex, (isValid) => {
            if (!isValid) {
                this.resetItineraryValidationMessage('Date should be between trip start and end date.');
                this.isValidPropertiesData = false;
            } else {
                this.isValidPropertiesData = true;
                /* if(!this._commonAppService.isUndefined(oldObject['checkInDate']) && !this._commonAppService.isUndefined(oldObject['checkOutDate'])){

                    let _startTIME = this._commonAppService.getFormattedTime(oldObject['checkInTime']);
                    let _endTIME = this._commonAppService.getFormattedTime(oldObject['checkOutTime']);
                    //if(_startTIME == '12:00')


                    let _startDate = this._commonAppService.getAsDate(oldObject['checkInDate'], (_startTIME == null || _startTIME == '')? '00:00': _startTIME);
                    let _endDate = this._commonAppService.getAsDate(oldObject['checkOutDate'], (_endTIME == null || _endTIME == '')? '23:59': _endTIME);

                    if(_startDate > _endDate){
                        this.isValidPropertiesData = false;
                        this.showValidationMessage('CheckOut Date should not greater than CheckIn Date.');
                    } else {
                        this.isValidPropertiesData = true;
                        this.validateDateValue(valueType, oldObject, oldValue, date, time, type, index, subCategoryIndex, itineraryTypeIndex);
                    }
                } else {
                    this.validateDateValue(valueType, oldObject, oldValue, date, time, type, index, subCategoryIndex, itineraryTypeIndex);
                } */
            }
        });
    }

    public validateCruiseDates(valueType, oldObject, oldValue, date, time, type, index, subCategoryIndex, itineraryTypeIndex) {


        this.validateDateWithStartDateEndDate(valueType, oldObject, oldValue, date, time, type, index, subCategoryIndex, itineraryTypeIndex, (isValid) => {
            if (!isValid) {
                this.resetItineraryValidationMessage('Date should be between trip start and end date.');
                this.showValidationMessage('Date should be between trip start and end date.');
                this.isValidCruiseData = false;
            }
            else {
                this.isValidCruiseData = true;
                /* if(!this._commonAppService.isUndefined(oldObject['departureDate']) && !this._commonAppService.isUndefined(oldObject['arrivalDate'])){
                    let _startTIME = this._commonAppService.getFormattedTime(oldObject['departureTime']);
                    let _endTIME = this._commonAppService.getFormattedTime(oldObject['arrivalTime']);
                    let _startDate = this._commonAppService.getAsDate(oldObject['departureDate'], (_startTIME == null || _startTIME == '')? '00:00': _startTIME);
                    let _endDate = this._commonAppService.getAsDate(oldObject['arrivalDate'], (_endTIME == null || _endTIME == '')? '23:59': _endTIME);
                    if(_startDate > _endDate){
                        this.isValidCruiseData = false;
                        this.showValidationMessage('Arrival Date should not greater than Departure Date.');
                      } else {
                        this.isValidCruiseData = true;
                        this.validateDateValue(valueType, oldObject, oldValue, date, time, type, index, subCategoryIndex, itineraryTypeIndex);
                    }
                } else {
                    this.validateDateValue(valueType, oldObject, oldValue, date, time, type, index, subCategoryIndex, itineraryTypeIndex);
                } */
            }
        });
    }

    public validateRoomDates(valueType, oldObject, oldValue, date, time, type, index, subCategoryIndex, itineraryTypeIndex) {

        this.validateDateWithStartDateEndDate(valueType, oldObject, oldValue, date, time, type, index, subCategoryIndex, itineraryTypeIndex, (isValid) => {
            if (!isValid) {
                this.showValidationMessage('Date should be between trip start and end date.');
                this.isValidPropertiesData = false;
            } else {

                if (type == 'properties') {
                    let _property = this.propertiesList[index];

                    let _propertyStartTIME = this._commonAppService.getFormattedTime(_property['checkInTime']);
                    let _propertyEndTIME = this._commonAppService.getFormattedTime(_property['checkOutTime']);

                    let _roomCategory = _property['roomCategories'][subCategoryIndex];
                    let _startDate = this._commonAppService.getAsDate(_roomCategory['checkInDate'], (_propertyStartTIME == null || _propertyStartTIME == '') ? '00:00' : _propertyStartTIME);
                    let _endDate = this._commonAppService.getAsDate(_roomCategory['checkOutDate'], (_propertyEndTIME == null || _propertyEndTIME == '') ? '23:59' : _propertyEndTIME);

                    if (!this._commonAppService.isUndefined(_roomCategory['checkInDate']) && !this._commonAppService.isUndefined(_roomCategory['checkOutDate'])) {
                        if (_startDate > _endDate) {
                            this.showValidationMessage('CheckOut Date should not greater than CheckIn Date.');
                            this.isValidPropertiesData = false;
                        } else {
                            this.isValidPropertiesData = true;
                            /* if(!this._commonAppService.isUndefined(_property['checkInDate']) && !this._commonAppService.isUndefined(_property['checkOutDate'])) {
                                
                                let _propertyStartDate = this._commonAppService.getAsDate(_property['checkInDate'], (_propertyStartTIME == null || _propertyStartTIME == '')? '00:00': _propertyStartTIME);
                                let _propertyEndDate = this._commonAppService.getAsDate(_property['checkOutDate'], (_propertyEndTIME == null || _propertyEndTIME == '')? '23:59': _propertyEndTIME);
                                if(_startDate >= _propertyStartDate && _startDate <= _propertyEndDate){
                                    if(_endDate <= _propertyEndDate && _endDate > _propertyStartDate){
                                    this.isValidPropertiesData = true;
                                    this.validateDateValue(valueType, oldObject, oldValue, date, time, type, index, subCategoryIndex, itineraryTypeIndex);
                                    }
                                    else
                                    {    
                                    this.showValidationMessage('Rooms CheckOut Date should be between cruise checkin and checkout date');
                                    this.isValidPropertiesData = false;
                                    }
                                }
                                else{
                                    this.showValidationMessage('Rooms CheckIn Date should be between cruise checkin and checkout date');
                                    this.isValidPropertiesData = false;
                                }
                               
                            } else {
                                this.validateDateValue(valueType, oldObject, oldValue, date, time, type, index, subCategoryIndex, itineraryTypeIndex);
                                this.isValidPropertiesData = true;
                            } */
                        }
                    }
                } else if (type == 'cruise') {
                    let _cruise = this.cruisesList[index];
                    let _cruiseStartTIME = this._commonAppService.getFormattedTime(_cruise['departureTime']);
                    let _cruiseEndTIME = this._commonAppService.getFormattedTime(_cruise['arrivalTime']);
                    let _roomCategory = _cruise['roomCategories'][subCategoryIndex];
                    let _startDate = this._commonAppService.getAsDate(_roomCategory['checkInDate'], (_cruiseStartTIME == null || _cruiseStartTIME == '') ? '00:00' : _cruiseStartTIME);
                    let _endDate = this._commonAppService.getAsDate(_roomCategory['checkOutDate'], (_cruiseEndTIME == null || _cruiseEndTIME == '') ? '00:00' : _cruiseEndTIME);

                    if (!this._commonAppService.isUndefined(_roomCategory['checkInDate']) && !this._commonAppService.isUndefined(_roomCategory['checkOutDate'])) {
                        if (_startDate > _endDate) {
                            this.showValidationMessage('CheckOut Date should not greater than CheckIn Date.');
                            this.isValidCruiseData = false;
                        } else {
                            this.isValidCruiseData = true;
                            /* if(!this._commonAppService.isUndefined(_cruise['departureDate']) && !this._commonAppService.isUndefined(_cruise['arrivalDate'])) {

                                let _cruiseStartDate = this._commonAppService.getAsDate(_cruise['departureDate'], (_cruiseStartTIME == null || _cruiseStartTIME == '')? '00:00': _cruiseStartTIME);
                                let _cruiseEndDate = this._commonAppService.getAsDate(_cruise['arrivalDate'], (_cruiseEndTIME == null || _cruiseEndTIME == '')? '23:59': _cruiseEndTIME);

                                if(_startDate >= _cruiseStartDate && _startDate <= _cruiseEndDate){
                                    if(_endDate <= _cruiseEndDate && _endDate > _cruiseStartDate){
                                    this.isValidPropertiesData = true;
                                    this.validateDateValue(valueType, oldObject, oldValue, date, time, type, index, subCategoryIndex, itineraryTypeIndex);
                                    }
                                    else
                                    {    
                                    this.showValidationMessage('Rooms CheckOut Date should be between cruise checkin and checkout date');
                                    this.isValidPropertiesData = false;
                                    }
                                }
                                else{
                                    this.showValidationMessage('Rooms CheckIn Date should be between cruise checkin and checkout date');
                                    this.isValidPropertiesData = false;
                                }
                              
                            } else {
                                this.showValidationMessage('Cruise departure and arrival should be between trip start and end date.');
                                this.isValidPropertiesData = false;
                            } */
                        }
                    }
                }

            }
        });
    }

    public validateTourDates(valueType, oldObject, oldValue, date, time, type, index, subCategoryIndex, itineraryTypeIndex) {


        this.validateDateWithStartDateEndDate(valueType, oldObject, oldValue, date, time, type, index, subCategoryIndex, itineraryTypeIndex, (isValid) => {
            if (!isValid) {
                this.showValidationMessage('Date should be between start and end date.');
                this.isValidTourData = false;
            } else {
                this.isValidTourData = true;
            }
        });
    }

    public validateTrainsDates(valueType, oldObject, oldValue, date, time, type, index, subCategoryIndex, itineraryTypeIndex) {

        this.validateDateWithStartDateEndDate(valueType, oldObject, oldValue, date, time, type, index, subCategoryIndex, itineraryTypeIndex, (isValid) => {
            if (!isValid) {
                this.showValidationMessage('Date should be between trip start and end date.');
                this.isValidTrainData = false;
            } else {
                this.isValidTrainData = true;
                /* if(!this._commonAppService.isUndefined(oldObject['departureDate']) && !this._commonAppService.isUndefined(oldObject['estimatedArrivalDate'])){

                    let _startTIME = this._commonAppService.getFormattedTime(oldObject['departureTime']);
                    let _endTIME = this._commonAppService.getFormattedTime(oldObject['estimatedArrivalTime']);

                    let _startDate = this._commonAppService.getAsDate(oldObject['departureDate'], (_startTIME == null || _startTIME == '')? '00:00': _startTIME);
                    let _endDate = this._commonAppService.getAsDate(oldObject['estimatedArrivalDate'], (_endTIME == null || _endTIME == '')? '23:59': _endTIME);

                    if(_startDate < _endDate){
                        this.isValidTrainData = true;
                        this.validateDateValue(valueType, oldObject, oldValue, date, time, type, index, subCategoryIndex, itineraryTypeIndex);
                    } else {
                        this.showValidationMessage('Departure Date should not be greater than Arrival Date.');
                        this.isValidTrainData = false;
                    }
                } else {
                    this.validateDateValue(valueType, oldObject, oldValue, date, time, type, index, subCategoryIndex, itineraryTypeIndex);
                } */
            }
        });
    }

    public validateCarDates(valueType, oldObject, oldValue, date, time, type, index, subCategoryIndex, itineraryTypeIndex) {

        this.validateDateWithStartDateEndDate(valueType, oldObject, oldValue, date, time, type, index, subCategoryIndex, itineraryTypeIndex, (isValid) => {
            if (!isValid) {
                this.showValidationMessage('Date should be between trip start and end date.');
                this.isValidCarData = false;
            } else {
                this.isValidCarData = true;
            }
        });
    }

    public validateGroundTransferDates(valueType, oldObject, oldValue, date, time, type, index, subCategoryIndex, itineraryTypeIndex) {

        this.validateDateWithStartDateEndDate(valueType, oldObject, oldValue, date, time, type, index, subCategoryIndex, itineraryTypeIndex, (isValid) => {
            if (!isValid) {
                this.showValidationMessage('Date should be between trip start and end date.');
                this.isValidGroundTransferData = false;
            } else {
                this.isValidGroundTransferData = true;
            }
        });
    }


    public validateDateWithStartDateEndDate(valueType, oldObject, oldValue, date, time, type, index, subCategoryIndex, itineraryTypeIndex, callback) {
        let _TIME = this._commonAppService.getFormattedTime(time);

        let checkDate = this._commonAppService.getAsDate(date, (_TIME == null || _TIME == '') ? '00:00' : _TIME);

        let _tripStartDate = this._commonAppService.getAsDate(this.tripObject['startDate'], '00:00');
        let _tripEndDate = this._commonAppService.getAsDate(this.tripObject['endDate'], '23:59');

        if (checkDate >= _tripStartDate && checkDate <= _tripEndDate) {
            callback(true);
            // this._commonAppService.showErrorMessage('Alert', "Date should be between start and end date.", function(alertRes){});
        } else {
            this._commonAppService.showErrorMessage('Alert', "Date should be between trip start and end date.", function (alertRes) { });
            callback(false);
        }
    }

    public saveItinerary(flag, allItinaryArray) {
        let THIS = this;
        // if(THIS.isValidPropertiesData == false){
        //     THIS._commonAppService.showErrorMessage('Alert', 'Please enter valid Resort/Hotel data', function(alertRes){});
        // } else if(THIS.isValidFlightData == false) {
        //     THIS._commonAppService.showErrorMessage('Alert', 'Please enter valid flight data', function(alertRes){});
        // } else if(THIS.isValidCruiseData == false) {
        //     THIS._commonAppService.showErrorMessage('Alert', 'Please enter valid cruise data', function(alertRes){});
        // } else if(THIS.isValidTourData == false) {
        //     THIS._commonAppService.showErrorMessage('Alert', 'Please enter valid tour data', function(alertRes){});
        // } else if(THIS.isValidTrainData == false) {
        //     THIS._commonAppService.showErrorMessage('Alert', 'Please enter valid train data', function(alertRes){});
        // } else if(THIS.isValidCarData == false) {
        //     THIS._commonAppService.showErrorMessage('Alert', 'Please enter valid car data', function(alertRes){});
        // } else if(THIS.isValidGroundTransferData == false) {
        //     THIS._commonAppService.showErrorMessage('Alert', 'Please enter valid ground transfer data', function(alertRes){});
        // } else {

        THIS._commonAppService.checkItineraryDetails(allItinaryArray, function (err, isValid) {
            if (err || isValid == false) {
                THIS._commonAppService.showErrorMessage('Alert', err, function (alertRes) { });
            } else {
                THIS._itineraryService.addUpdateItinerary(THIS.currentUser, THIS.itineraryObject, THIS.itineraryObject['_id'])
                    .subscribe((data: any) => {
                        if (data.status == '1') {
                            THIS._commonAppService.showSuccessMessage('Alert', data.result.message, function (alertRes) { });
                            THIS.clearItineraryFromLocalStorage();
                        } else {
                            THIS._commonAppService.showErrorMessage('Alert', data.result.message, function (alertRes) { });
                        }
                        if (data.status == '1' && THIS.itineraryObject['_id'] == '') {
                            THIS.itineraryObject['_id'] = data.result._id;
                        }
                        THIS.getItinerariesByTripId(THIS.tripObject['_id']);
                        if (flag == true) {
                            THIS.closePage();
                        }
                    },
                    (error: any) => {
                        THIS._commonAppService.showErrorMessage('Alert', error, function (alertRes) { });
                        if (flag == true) {
                            THIS.closePage();
                        }
                    });
            }
        });
        // }

    }

    public saveItineraryToLocalStorage(type, array) {
        let THIS = this;
        THIS._commonAppService.validateObject(array, function (err, isValid) {
            if (err || isValid == false) {
                THIS._commonAppService.showErrorMessage('Alert', err, function (alertRes) { });
            } else {
                THIS._localStorageService.setData(type, array);
            }
        });
    }

    public clearItineraryFromLocalStorage() {
        let array = ['flights', 'properties', 'cruises', 'tours', 'trains', 'carRentals', 'groundTransfer'];
        array.forEach(element => {
            this._localStorageService.removeData(element);
        });
    }

    public getItineraryByKey(key, value) {
        let _storage = this._localStorageService.getData(key);

        let returnVal = [];

        if (value && value.length > 0) {
            returnVal = value;
        } else if (_storage) {
            returnVal = _storage;
        }
        return returnVal;
    }

    public getPropertyList() {

        this._propertyService.getAllProperties(this.currentUser, { isFullList: true })
            .subscribe((data: any) => {
                if (data.status == '1') {
                    this.allPropertyList = data.result.properties;
                    for (let i = 0; i < this.allPropertyList.length; i++) {
                        this.propertyAutocompleteList.push({
                            name: this.allPropertyList[i].name,
                            _id: this.allPropertyList[i]._id,
                        });
                    }
                } else {
                    this.allPropertyList = [];
                }
                this.getCruiseItinerariesList();
            },
                (error: any) => {
                    console.log(' Error :  ' + JSON.stringify(error));
                });
    }

    public getEventOfTrip(tripId) {

        this._eventsService.getEventTripById(this.currentUser, tripId, 'trip')
            .subscribe((data: any) => {
                if (data.status == '1') {
                    this.tripEvent = data.result.event;
                } else {
                    this.tripEvent = null;
                }
            },
            (error: any) => {
                console.log(' Error :  ' + JSON.stringify(error));
            });
    }

    public getCruiseItinerariesList() {

        this._cruiseService.getAllCruiseItinerariesTitleList(this.currentUser, {})
            .subscribe((data: any) => {
                if (data.status == '1') {
                    this.allCruiseItinerariesTitleList = data.result.cruiseitineraries;
                    for (let i = 0; i < this.allCruiseItinerariesTitleList.length; i++) {
                        this.cruiseAutocompleteList.push({
                            title: this.allCruiseItinerariesTitleList[i].title,
                            _id: this.allCruiseItinerariesTitleList[i]._id,
                        });
                    }
                } else {
                    this.allCruiseItinerariesTitleList = [];
                }
                this.getCruiseList();
            },
            (error: any) => {
                console.log(' Error :  ' + JSON.stringify(error));
            });
    }

    public getCruiseList() {

        this._cruiseService.getAllCruiseLines(this.currentUser, {})
            .subscribe((data: any) => {
                if (data.status == '1') {
                    this.allCruiseList = data.result.cruiselines;
                } else {
                    this.allCruiseList = [];
                }
                this.getAllRoomList();
            },
                (error: any) => {
                    console.log(' Error :  ' + JSON.stringify(error));
                });
    }

    public getAllRoomList() {

        this._roomService.getAllRooms(this.currentUser, {})
            .subscribe((data: any) => {
                if (data.status == '1') {
                    this.allRoomList = data.result.rooms;
                    if (!this._commonAppService.isUndefined(this.allRoomList)) {
                        this.allRoomList.forEach((room) => {
                            if (room.type == 'property') {
                                this.propertyRoomList.push(room);
                            }
                            else {
                                this.cruiseRoomList.push(room);
                            }
                        });
                    }
                    else {
                        this.allRoomList = [];
                        this.propertyRoomList = [];
                        this.cruiseRoomList = [];
                    }
                } else {
                    this.allRoomList = [];
                    this.propertyRoomList = [];
                    this.cruiseRoomList = [];
                }
            },
                (error: any) => {
                    console.log(' Error :  ' + JSON.stringify(error));
                });
    }

    public showValidationMessage(message) {
        this._commonAppService.showErrorMessage('Alert', message, function (alertRes) { });
    }

    public resetItineraryValidationMessage(message) {
        this.itineraryValidationMessage = message;
        setTimeout(() => {
            this.itineraryValidationMessage = '';
        }, 5000);
    }

    public cruiseTitinerarySelectChange(cruiseItineraryId: any, index: any) {
        this.allCruiseItinerariesTitleList.forEach(cruiseItinerary => {
            if (cruiseItinerary._id == cruiseItineraryId) {
                this.cruisesList[index]['cruiseId'] = cruiseItinerary.cruise_line_id;
            }
        });
    }

    public typeaHeadCruiseOnSelect(e: any, index: any): void {
        let cruiseItineraryId = e.item._id;

        this.allCruiseItinerariesTitleList.forEach(cruiseItinerary => {
            if (cruiseItinerary._id == cruiseItineraryId) {
                this.cruisesList[index]['cruiseId'] = cruiseItinerary.cruise_line_id;
                this.cruisesList[index]['cruiseItineraryId'] = cruiseItineraryId;
            }
        });
    }


    public typeaHeadPropertyOnSelect(e: any, index: any): void {
        let propertyId = e.item._id;

        this.allPropertyList.forEach(property => {
            if (property._id == propertyId) {
                this.propertiesList[index]['propertyId'] = propertyId;
            }
        });
    }

    // public changeTypeaheadNoResults(e: boolean): void {
    //     this.typeaheadNoResults = e;
    // }

    public onNameChange() {

    }

    public updateCount(event) {
        
        for (var prop in event) {
            this.countInfo[prop] = event[prop];
        }

    }

    public showBookingTabChange(event) {
        if (event.showBookingTab) {
            this.showBookingTab = false;
            this.bookingTab.nativeElement.click();
        }
        else {
            this.showBookingTab = true;
            this.bookingInfoTab.nativeElement.click();
        }
    }
    public tabSelectedEvent() {
        this.showBookingTab = false;
    }
    public GetFormattedBirthday(birthdate) {
        if (birthdate != "") {

            let checkDate = new Date(birthdate);

            let _tripStartDate = this._commonAppService.getAsDate(this.tripObject['startDate'], '00:00');
            let _tripEndDate = this._commonAppService.getAsDate(this.tripObject['endDate'], '23:59');
            if (checkDate.getMonth() >= _tripStartDate.getMonth() && checkDate.getMonth() <= _tripEndDate.getMonth()) {
                if (checkDate.getDate() >= _tripStartDate.getDate() && checkDate.getDate() <= _tripEndDate.getDate()) {
                    return this.getAge(checkDate, _tripStartDate)
                }
                else { return ""; }

            } else { return ""; }

        } else { return ""; }

    }

    public GetFormattedAnniversaryDate(anniversaryDate) {
        return anniversaryDate;
        // console.log("GetFormattedAnniversaryDate called");
        // if (anniversaryDate != "") {

        //     let checkDate = new Date(anniversaryDate);

        //     let _tripStartDate = this._commonAppService.getAsDate(this.tripObject['startDate'], '00:00');
        //     let _tripEndDate = this._commonAppService.getAsDate(this.tripObject['endDate'], '23:59');
            
        //     if (checkDate.getMonth() >= _tripStartDate.getMonth() && checkDate.getMonth() <= _tripEndDate.getMonth()) {
        //         if (checkDate.getDate() >= _tripStartDate.getDate() && checkDate.getDate() <= _tripEndDate.getDate()) {
        //             var message = '(Anniversary date: ' + this._datePipe.transform(anniversaryDate, 'MMM dd,yyyy') + ')';
        //             return message;
        //         }
        //         else { return ""; }

        //     } else { return ""; }

        // } else { return ""; }
    }

    public getAge(birth_date, tripStartDate) {
        var a = moment(tripStartDate);
        var b = moment(birth_date);

        let aDate = a.toDate();
        let bDate = b.toDate();

        let year_diff = aDate.getFullYear() - bDate.getFullYear();
        let month_diff = Math.abs(aDate.getMonth() - bDate.getMonth());
        let day_diff = Math.abs(aDate.getDate() - bDate.getDate());

        var years = a.diff(b, 'year');
        b.add(years, 'years');

        var months = a.diff(b, 'months');
        b.add(months, 'months');

        var days = a.diff(b, 'days');
        var message = '(Birth date: ' + this._datePipe.transform(birth_date, 'MMM dd,yyyy') + ' / ' + year_diff + ' years ' + month_diff + ' months ' + day_diff + ' days old on trip start day)';
        return message;
    }

    public typeaHeadTourOperatorOnSelect(e: any): void {
        // let THIS = this;

        this.travelerObject.travelerId = e.item._id;

        // this.travelerObject.forEach(traveler => {
        //  var t = traveler._id;
        // var name = traveler.name;
        /* if(traveler._id == propertyId){
            THIS.propertiesList[index]['propertyId'] = propertyId;
        } */
        // });
    }

    public isReflectPayment($event) {
        this.getBookingInfomation();
    }

    public isReflectBooking($event) {
        this.getBookingInfomation();
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
}


