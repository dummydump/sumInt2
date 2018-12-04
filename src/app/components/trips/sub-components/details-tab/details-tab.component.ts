/**
 * Details Tab Page Component.
 */
// tslint:disable-next-line:max-line-length
import { Component, ViewChild, NgModule, OnInit, Output, AfterViewInit, EventEmitter, OnDestroy, ElementRef, NgZone, Renderer, Directive, Inject, ViewContainerRef, OnChanges, SimpleChanges, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonAppService, TripService, UserService, TripDetailService } from '../../../../services/index';
import { GlobalVariable } from '../../../../services/static-variable';
import {BrowserModule, DomSanitizer, SafeHtml} from '@angular/platform-browser'
import { TinyEditorComponent } from '../../../custom/tiny-editor.component/tiny-editor.component';

@Component({
    providers: [
        CommonAppService,
        TripService,
        UserService,
        TripDetailService
    ],
    selector: 'details-tab',
    styleUrls: ['./details-tab.component.css'],
    templateUrl: './details-tab.component.html'
})

export class DetailsTabComponent implements OnInit, AfterViewInit {
    public currentUser: any;
    public isItineraryEditorShow = false;
    public isSecurityEditorShow = false;
    public isFlightEditorShow = false;
    public isContentSaved = false;
    public currentContent = '';
    public itineraryDetail = {
        _id: 0,
        tripId: '',
        tripDetailType: 'itinerary',
        tripDetailContent: ''
    };
    public securityDetail = {
        _id: 0,
        tripId: '',
        tripDetailType: 'security',
        tripDetailContent: ''
    };
    public flightDetail = {
        _id: 0,
        tripId: '',
        tripDetailType: 'flight',
        tripDetailContent: ''
    };
    public itineraryDetailHTML;
    public itineraryDetailHtml;
    public securityDetailHtml;
    public flightDetailHtml;

    @Input('tripObject') tripObject;
    @ViewChild('itineraryeditor') itineraryeditor: TinyEditorComponent;
    @ViewChild('securityEditor') securityEditor: TinyEditorComponent;
    @ViewChild('flightEditor') flightEditor: TinyEditorComponent;
    
    constructor(
        public _route: ActivatedRoute,
        public _router: Router,
        public _commonAppService: CommonAppService,
        public _tripService: TripService,
        public _userService: UserService,
        public _viewContainerRef: ViewContainerRef,
        private sanitizer: DomSanitizer,
        public _tripDetailService: TripDetailService,
    ) {

        this._commonAppService.getCurrentUserSession( (user) => {
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
          if (!this._commonAppService.isUndefined(this.tripObject)) {
                this.itineraryDetail.tripId = this.tripObject._id;
                this.securityDetail.tripId = this.tripObject._id;
                this.flightDetail.tripId = this.tripObject._id;
                this.refreshTripDetails();
             }
         }
    }
    public toolbarConfig = "bold italic underline strikethrough | alignleft aligncenter alignright " +
    " alignjustify alignnone  | styleselect formatselect | fontselect fontsizeselect | forecolor backcolor | link | code";

    public refreshTripDetails() {
        if(this._commonAppService.isUndefined(this.tripObject._id)){
            return;
        }
        let THIS = this;

        let data = {
            tripId: THIS.tripObject._id,
        };

        THIS._commonAppService.spinner.show();
        THIS._tripDetailService.getTripDetails(THIS.currentUser, data)
            .subscribe((data: any) => {
                if (data.status === '1') {
                var details = data.result.tripDetails
                
                for (var i = 0 ; i < details.length; i ++) {
                    if ( details[i].tripDetailType === 'itinerary') {
                        THIS.itineraryDetail = details[i];
                        THIS.itineraryeditor.setContent(details[i].tripDetailContent);
                        THIS.itineraryDetailHtml = this.sanitizeHtml(details[i].tripDetailContent);
                        THIS.itineraryDetailHTML=THIS.itineraryDetailHtml.changingThisBreaksApplicationSecurity;
                    } else if (details[i].tripDetailType === 'security') {
                        THIS.securityDetail = details[i];
                        THIS.securityEditor.setContent(details[i].tripDetailContent);
                        THIS.securityDetailHtml = this.sanitizeHtml(details[i].tripDetailContent);
                    } else if ( details[i].tripDetailType === 'flight') {
                        THIS.flightDetail = details[i];
                        THIS.flightEditor.setContent(details[i].tripDetailContent);
                        THIS.flightDetailHtml = this.sanitizeHtml(details[i].tripDetailContent);
                    }
                }
                } else {

                }
            },
            (error: any) => {
                console.log(' Error while getAllTrips :  ' + JSON.stringify(error));
            });
        setTimeout(() => {
            this._commonAppService.spinner.hide();
        }, 1000);

    }
    public sanitizeHtml(_content) {
      return this.sanitizer.bypassSecurityTrustHtml(_content);

    }
    public itineraryeditorContentChange(event) {
        this.itineraryDetail.tripDetailContent = event;
    }

    public updateItineraryClick(){
        this.isItineraryEditorShow=true;
        this.itineraryeditor.setContent(this.itineraryDetail.tripDetailContent);
    }

    public updateSecurityClick(){
        this.isSecurityEditorShow=true;
        this.securityEditor.setContent(this.securityDetail.tripDetailContent);
    }

    public updateFlightClick(){
        this.isFlightEditorShow=true;
        this.flightEditor.setContent(this.flightDetail.tripDetailContent);
    }

    public saveItineraryNote(){
        if(this._commonAppService.isUndefined(this.tripObject._id)){
            this._commonAppService.showErrorMessage('Alert', this._commonAppService.TripNotFoundMessage, function (alertRes) {
            });
            return;
        }
        var THIS = this;
        THIS.itineraryDetail.tripDetailContent = THIS.itineraryDetail.tripDetailContent.split('<p>&nbsp;</p>').join('');
        if (this.itineraryDetail._id === 0 ) {
            this.saveDetails(this.itineraryDetail, function(id) {
              THIS.itineraryDetail._id = id;
              THIS.itineraryDetailHtml = THIS.sanitizeHtml(THIS.itineraryDetail.tripDetailContent);
              THIS.isItineraryEditorShow = false;
              THIS.refreshTripDetails();
             });
        } else {
            this.updateDetails(this.itineraryDetail, function() {
                THIS.itineraryDetailHtml = THIS.sanitizeHtml(THIS.itineraryDetail.tripDetailContent);
                THIS.isItineraryEditorShow = false;
            });
        }
    }
    public removeItineraryNote() {
        var THIS = this;
        if(this.itineraryDetail._id!==0){
            this.removeDetails(this.itineraryDetail, function(id){
              THIS.itineraryDetail._id=0;
              THIS.itineraryDetail.tripDetailContent='';
              THIS.itineraryeditor.setContent('');
              THIS.itineraryDetailHTML='';
              THIS.isItineraryEditorShow = false;
             });
             
        }
    }

    public securityEditorContentChange(event) {
        this.securityDetail.tripDetailContent = event;
    }


    public saveSecurityNote(){
        if(this._commonAppService.isUndefined(this.tripObject._id)){
            this._commonAppService.showErrorMessage('Alert', this._commonAppService.TripNotFoundMessage, function (alertRes) {

        });
            return;
        }
        var THIS = this;
        THIS.securityDetail.tripDetailContent = THIS.securityDetail.tripDetailContent.split('<p>&nbsp;</p>').join('');
        if (this.securityDetail._id === 0 ) {
            this.saveDetails(this.securityDetail, function(id) {
              THIS.securityDetail._id = id;
              THIS.securityDetailHtml = THIS.sanitizeHtml(THIS.securityDetail.tripDetailContent);
              THIS.isSecurityEditorShow = false;
             });
         } else {
            this.updateDetails(this.securityDetail, function() {
                THIS.securityDetailHtml = THIS.sanitizeHtml(THIS.securityDetail.tripDetailContent);
                THIS.isSecurityEditorShow = false;
            });
         }
    }

    public removeSecurityNote(){
        var THIS = this;
        if(this.securityDetail._id!==0){
            this.removeDetails(this.securityDetail, function(id){
                THIS.securityDetail._id=0;
                THIS.securityDetail.tripDetailContent='';
                THIS.securityEditor.setContent('');
                THIS.securityDetailHtml='';
                THIS.isSecurityEditorShow = false;
             })
        }
    }
    
    public flightDetailContentChange(event) {
        this.flightDetail.tripDetailContent = event;
    }
    public saveFlightNote(){
        if(this._commonAppService.isUndefined(this.tripObject._id)){
            this._commonAppService.showErrorMessage('Alert', this._commonAppService.TripNotFoundMessage, function (alertRes) {
            });
            return;
        }
        var THIS = this;
        THIS.flightDetail.tripDetailContent = THIS.flightDetail.tripDetailContent.split('<p>&nbsp;</p>').join('');
        if (this.flightDetail._id === 0) {
            this.saveDetails(this.flightDetail, function(id) {
              THIS.flightDetail._id = id;
              THIS.flightDetailHtml = THIS.sanitizeHtml(THIS.flightDetail.tripDetailContent);
              THIS.isFlightEditorShow = false;
             });
         } else {
            this.updateDetails(this.flightDetail, function() {
                THIS.flightDetailHtml = THIS.sanitizeHtml(THIS.flightDetail.tripDetailContent);
                THIS.isFlightEditorShow = false;
            });
         }
    }
    public removeFlightNote() {
        var THIS = this;
        if(this.flightDetail._id!==0){
            this.removeDetails(this.flightDetail, function(id){
              THIS.flightDetail._id=0;
              THIS.flightDetail.tripDetailContent='';
              THIS.flightEditor.setContent('');
              THIS.flightDetailHtml ='';
              THIS.isFlightEditorShow = false;
             });
        }
    }

    public saveDetails(detail, success) {
        var THIS = this;
        THIS._tripDetailService.addTripDetails(THIS.currentUser, detail, false)
        .subscribe((res: any) => {
            if (res.status === '1') {
               success(res.result._id);
                THIS._commonAppService.showSuccessMessage('Alert', res.result.message, function(alertRes){ 
                });
               // THIS.refreshNotes(this.pageCount, this.limit);
               
            } else {
                this._commonAppService.showErrorMessage('Alert', res.result.message, function (alertRes) {
                });
            }
        },
            (error: any) => {
                console.log(' Error while getAllTrips :  ' + JSON.stringify(error));
            });
    }
    public removeDetails(detail, success) {
        var THIS = this;
        THIS._tripDetailService.removeTripDetailsById(THIS.currentUser, detail._id)
        .subscribe((res: any) => {
            if (res.status === '1') {
               success();
                THIS._commonAppService.showSuccessMessage('Alert', res.result.message, function(alertRes){
                });
               // THIS.refreshNotes(this.pageCount, this.limit);
            } else {
                this._commonAppService.showErrorMessage('Alert', res.result.message, function (alertRes) {
                });
            }
        },
            (error: any) => {
                console.log(' Error while getAllTrips :  ' + JSON.stringify(error));
            });
    }

    public updateDetails(detail, success) {
        var THIS = this;
        THIS._tripDetailService.updateTripDetailsById(THIS.currentUser, detail)
        .subscribe((res: any) => {
            if (res.status === '1') {
                success();
                THIS._commonAppService.showSuccessMessage('Alert', res.result.message, function(alertRes){
                });
               // THIS.refreshNotes(this.pageCount, this.limit);
               THIS.refreshTripDetails();
            } else {
                this._commonAppService.showErrorMessage('Alert', res.result.message, function (alertRes) {
                });
            }
        },
            (error: any) => {
                console.log(' Error while getAllTrips :  ' + JSON.stringify(error));
            });
    }
}
