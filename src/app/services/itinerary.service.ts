/**
 * Itinerary Services.
 */

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { Http, Response, Headers, Request, RequestOptions, RequestMethod, URLSearchParams } from '@angular/http';
import { GlobalVariable } from '../services/static-variable';

@Injectable()
export class ItineraryService {

    constructor(
        public _http: Http,
        public _router: Router) {
    }

    public addUpdateItinerary(currentUser: any, itinerary: any, isUpdate: any) {
        
        let body = JSON.stringify(itinerary);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json' );
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + ((isUpdate == '') ? GlobalVariable.ADD_ITINERARY : GlobalVariable.UPDATE_ITINERARY_BY_ID + '/' + itinerary._id);
        return this._http.post(URL, body, options)
            .map((data: any) => {
                return data.json();
            });
    }

    public getItineraryById(currentUser: any, itineraryId) {
        let headers = new Headers();
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions( {headers: headers });
        return this._http.get(GlobalVariable.BASE_API_URL + GlobalVariable.GET_ITINERARY_BY_ID + '/' + itineraryId, options)
            .map((data: any) => {
                data.json();
                return data.json();
            });
    }

    public getItineraryByTripId(currentUser: any, tripId) {
        let headers = new Headers();
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions( {headers: headers });
        return this._http.get(GlobalVariable.BASE_API_URL + GlobalVariable.GET_ITINERARY_BY_TRIP_ID + '/' + tripId, options)
            .map((data: any) => {
                data.json();
                return data.json();
            });
    }

    public getAllItineraries(currentUser: any, data) {
        
        let body = JSON.stringify(data);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json' );
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.GET_ALL_ITINERARIES;
        return this._http.post(URL, body, options)
            .map((data: any) => {
                return data.json();
            });
    }
    
    public removeItineraryById(currentUser: any, itineraryId) {
        
        let headers = new Headers();
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.REMOVE_ITINERARY_BY_ID + '/' + itineraryId;
        return this._http.post(URL, {}, options)
            .map((data: any) => {
                return data.json();
            });
    }
}