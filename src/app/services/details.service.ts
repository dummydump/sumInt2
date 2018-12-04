/**
 * Trip Services.
 */

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { Http, Response, Headers, Request, RequestOptions, RequestMethod, URLSearchParams } from '@angular/http';
import { GlobalVariable } from '../services/static-variable';


@Injectable()
export class TripDetailService {

    constructor(
        public _http: Http,
        public _router: Router) {
    }
   
    public addTripDetails(currentUser: any, note: any, isUpdate: any) {
        let THIS = this;
        let body = JSON.stringify(note);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });

        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.ADD_TRIP_DETAIL;
        return this._http.post(URL, body, options)
            .map((data: any) => {
                return data.json();
            });
    }
       
    

    public getTripDetailsById(currentUser: any, data) {
        let THIS = this;
        let body = JSON.stringify(data);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json' );
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        return this._http.post(GlobalVariable.BASE_API_URL + GlobalVariable.GET_TRIP_DETAIL_BY_ID,data,options)
            .map((data: any) => {
                data.json();
                return data.json();
            });
    }

    public updateTripDetailsById(currentUser: any, note) {
        let THIS = this;
        let tripDetailId = note._id;
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);

        let body = JSON.stringify(note);
        let options = new RequestOptions({ headers: headers });
        
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.UPDATE_TRIP_DETAIL_BY_ID + '/' + tripDetailId;
        return this._http.post(URL, body, options)
            .map((data: any) => {
                return data.json();
            });
    }
    public removeTripDetailsById(currentUser: any, tripDetailId) {
        let THIS = this;
        let headers = new Headers();
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.REMOVE_TRIP_DETAIL_BY_ID + '/' + tripDetailId;
        return this._http.post(URL, {}, options)
            .map((data: any) => {
                return data.json();
            });
    }
    public getTripDetails(currentUser: any, data) {
        let THIS = this;
        let body = JSON.stringify(data);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json' );
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        return this._http.post(GlobalVariable.BASE_API_URL + GlobalVariable.GET_TRIP_DETAILS,data,options)
            .map((data: any) => {
                data.json();
                return data.json();
            });
    }
    
}