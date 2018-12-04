/**
 * Trip Services.
 */

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { Http, Response, Headers, Request, RequestOptions, RequestMethod, URLSearchParams } from '@angular/http';
import { GlobalVariable } from '../services/static-variable';

@Injectable()
export class FlightActivity {

    constructor(
        public _http: Http,
        public _router: Router) {
    }
   
    public addUpdateTripActivity(currentUser: any, tripactivity: any, isUpdate: any) {
        
        let body = JSON.stringify(tripactivity);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        // let URL = GlobalVariable.BASE_API_URL + GlobalVariable.ADD_TRIP_ACTIVITY;

        // tslint:disable-next-line:max-line-length
        let URL = GlobalVariable.BASE_API_URL + ((isUpdate == 0) ? GlobalVariable.ADD_TRIP_ACTIVITY : GlobalVariable.UPDATE_TRIP_ACTIVITY_BY_ID + '/' + tripactivity._id);

        return this._http.post(URL, body, options)
            .map((data: any) => {
                return data.json();
            });
    }
    
    public getTripActivity(currentUser: any, data) {
        
        let body = JSON.stringify(data);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json' );
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        return this._http.post(GlobalVariable.BASE_API_URL + GlobalVariable.GET_TRIP_ACTIVITY, data, options)
            .map((data: any) => {
                data.json();
                return data.json();
            });
    }
    
    public getAllTripActivity(currentUser: any, data) {
        
        let body = JSON.stringify(data);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json' );
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        return this._http.post(GlobalVariable.BASE_API_URL + GlobalVariable.GET_ALL_TRIP_ACTIVITY, data, options)
            .map((data: any) => {
                data.json();
                return data.json();
            });
    }

    public getTripActivityById(currentUser: any, activityId) {
        let headers = new Headers();
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions( {headers: headers });
        return this._http.get(GlobalVariable.BASE_API_URL + GlobalVariable.GET_TRIP_ACTIVITY_BY_ID + '/' + activityId, options)
            .map((data: any) => {
                data.json();
                return data.json();
            });
    }
    public removeTripActivityById(currentUser: any, activityId) {
        
        let headers = new Headers();
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.REMOVE_TRIP_ACTIVITY_BY_ID + '/' + activityId;
        return this._http.post(URL, {}, options)
            .map((data: any) => {
                return data.json();
            });
    }
    
    
}