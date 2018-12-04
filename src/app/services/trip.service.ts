/**
 * Trip Services.
 */

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { Http, Response, Headers, Request, RequestOptions, ResponseContentType, RequestMethod, URLSearchParams } from '@angular/http';
import { GlobalVariable } from '../services/static-variable';
import { CommonAppService } from '../services/commonapp.service';
import * as FileSaver from 'file-saver';

@Injectable()
export class TripService {

    constructor(
        public _http: Http,
        public _commonAppService: CommonAppService,
        public _router: Router) {
    }

    public addUpdateTrip(currentUser: any, trip: any, isUpdate: any) {
        let THIS = this;
        let body = JSON.stringify(trip);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + ((isUpdate == '') ? GlobalVariable.ADD_TRIP : GlobalVariable.UPDATE_TRIP_BY_ID + '/' + trip._id);
        return this._http.post(URL, body, options)
            .map((data: any) => {
                return data.json();
            });
    }

    public getTripById(currentUser: any, tripId) {
        let headers = new Headers();
        let data = {};
        data['userId'] = this._commonAppService.getCurrentUserId(currentUser);
        data['roleName'] = this._commonAppService.getCurrentUserRole(currentUser);

        let body = JSON.stringify(data);
        headers.append('Content-Type', 'application/json');
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);

        let options = new RequestOptions({ headers: headers });
        return this._http.post(GlobalVariable.BASE_API_URL + GlobalVariable.GET_TRIP_BY_ID + '/' + tripId, body, options)
            .map((data: any) => {
                data.json();
                return data.json();
            });
    }

    public getAllTrips(currentUser: any, data) {
        let THIS = this;
        data['userId'] = this._commonAppService.getCurrentUserId(currentUser);
        data['roleName'] = this._commonAppService.getCurrentUserRole(currentUser);
        let body = JSON.stringify(data);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);

        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.GET_ALL_TRIPS;
        return this._http.post(URL, body, options)
            .map((data: any) => {
                return data.json();
            });
    }

    public getAllShips(currentUser: any, data) {
        let THIS = this;
        let body = JSON.stringify(data);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.GET_ALL_SHIPS;
        return this._http.post(URL, body, options)
            .map((data: any) => {
                return data.json();
            });
    }

    public removeTripById(currentUser: any, tripId) {
        let THIS = this;
        let headers = new Headers();
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.REMOVE_TRIP_BY_ID + '/' + tripId;
        return this._http.post(URL, {}, options)
            .map((data: any) => {
                return data.json();
            });
    }

    public getPropertyById(currentUser: any, propertyId: string) {
        let headers = new Headers();
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        return this._http.get(GlobalVariable.BASE_API_URL + GlobalVariable.GET_PROPERTIES_BY_ID + '/' + propertyId, options)
            .map((data: any) => {
                data.json();
                return data.json();
            });
    }

    public getRoomById(currentUser: any, roomId: string) {
        let headers = new Headers();
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        return this._http.get(GlobalVariable.BASE_API_URL + GlobalVariable.GET_ROOM_BY_ID + '/' + roomId, options)
            .map((data: any) => {
                data.json();
                return data.json();
            });
    }

    public getCruiseLineById(currentUser: any, cruiseLineId: string) {
        let headers = new Headers();
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        return this._http.get(GlobalVariable.BASE_API_URL + GlobalVariable.GET_CRUISE_BY_ID + '/' + cruiseLineId, options)
        .map((data: any) => {
            data.json();
            return data.json();
        });
    }

    public sendItineraryEmail(currentUser: any, data: any, flage: any) {
        // let formData: FormData = new FormData(); 
        // formData.append('sendTo', data.sendTo);
        // formData.append('subject', data.subject);
        // formData.append('body', data.body);
        // formData.append('htmlBody', data.htmlBody);
        // formData.append('itineraryId', data.itineraryId);
        // formData.append('itineraryFieldsTimeArr', data.itineraryFieldsTimeArr);
        // formData.append('attachment', data.attachment);
        // formData.append('html', data.html);

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        // headers.append('Content-Type', 'multipart/form-data');
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });

        let URL = (flage == 'Itinerary') ?GlobalVariable.BASE_API_URL + GlobalVariable.SEND_MAIL : GlobalVariable.BASE_API_URL + GlobalVariable.SEND_INVOICE_MAIL;
        return this._http.post(URL, data, options)
            .map((data: Response) => {
                return data.json();
            });
    }

    public downloadPDF(currentUser: any, data: any) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/pdf');
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);

        // let options = new RequestOptions({ headers: headers });

        let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob });

        // options.responseType = ResponseContentType.Blob;

        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.DOWNLOAD_PDF;
        return this._http.post(URL, data, options)
            .map((response: Response) => {
                let fileBlob = response.blob();
                let blob = new Blob([fileBlob], {
                    type: 'application/pdf' // must match the Accept type
                });
                FileSaver.saveAs(blob, data.pdfName);
                return {};
            });
    }

    public getCountInfo(currentUser:any, data: any){
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({headers : headers});
        return this._http.get(GlobalVariable.BASE_API_URL + GlobalVariable.GET_COUNT_BY_TRIPID + '/' + data, options)
            .map((data: any) => {
                data.json();
                return data.json();
            });

    }
    
}