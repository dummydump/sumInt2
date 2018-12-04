/**
 * Property Services.
 */

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { Http, Response, Headers, Request, RequestOptions, RequestMethod, URLSearchParams } from '@angular/http';
import { GlobalVariable } from '../services/static-variable';

@Injectable()
export class CruiseService {

    constructor(
        public _http: Http,
        public _router: Router) {
    }
    
    public getAllCruiseLines(currentUser: any, data) {
        
        let body = JSON.stringify(data);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json' );
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.GET_ALL_CRUISE_LINES;
        return this._http.post(URL, body, options)
            .map((data: any) => {
                return data.json();
            }); 
    }

    public listCruiseLinesByIds(currentUser: any, data) {
        
        let body = JSON.stringify(data);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json' );
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.GET_CRUISE_LINES_BY_IDS;
        return this._http.post(URL, body, options)
            .map((data: any) => {
                return data.json();
            }); 
    }
    
    public getAllCruiseItinerariesTitleList(currentUser: any, data) {
        
        let body = JSON.stringify(data);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json' );
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.GET_ALL_CRUISE_ITINERARIES_TITLE;
        return this._http.post(URL, body, options)
            .map((data: any) => {
                return data.json();
            });
    }

    public removeCruiseItinerarieById(currentUser: any, cruiseItinerarieId) {
        
        let headers = new Headers();
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.REMOVE_CRUISE_ITINERARY_BY_ID + '/' + cruiseItinerarieId;
        return this._http.post(URL, {}, options)
            .map((data: any) => {
                return data.json();
            });
    }  


    


    
    public addUpdateCruiseItinerary(currentUser: any, cruiseItinerary: any, isUpdate: any) {
       
    let body = JSON.stringify(cruiseItinerary);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json' );
    headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
    let options = new RequestOptions({ headers: headers });
    let URL = GlobalVariable.BASE_API_URL + ((isUpdate == '') ? GlobalVariable.ADD_CRUISE_ITINERARY : GlobalVariable.UPDATE_CRUISE_ITINERARY_BY_ID + '/' + cruiseItinerary._id);
    return this._http.post(URL, body, options)
        .map((data: any) => {
            return data.json();
        });
    }


    public getCruiseItineraryById(currentUser: any, cruiseItineraryId) {
    let headers = new Headers();

    let data = {};

    let body = JSON.stringify(data);
    headers.append('Content-Type', 'application/json');
    headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);

    let options = new RequestOptions( {headers: headers });
    return this._http.get(GlobalVariable.BASE_API_URL + GlobalVariable.GET_CRUISE_ITINERARY_BY_ID + '/' + cruiseItineraryId, options)
        .map((data: any) => {
            data.json();
            return data.json();
        });
    }



    public removeCruiseLinesById(currentUser: any, cruiseLinesId) {
        
        let headers = new Headers();
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.REMOVE_CRUISE_LINES_BY_ID + '/' + cruiseLinesId;
        return this._http.post(URL, {}, options)
            .map((data: any) => {
                return data.json();
            });
    }
    
    public getCruiseLinesById(currentUser: any, cruiseLinesId) {
        
        let headers = new Headers();
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.GET_CRUISE_BY_ID + '/' + cruiseLinesId;
        return this._http.get(URL, options)
            .map((data: any) => {
                return data.json();
            });
    }

    public addCruiseLine(currentUser: any, data) {
        
        let headers = new Headers();
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.ADD_CRUISELINE ;
        return this._http.post(URL, data, options)
            .map((data: any) => {
                return data.json();
            });
    }

    public updateCruiseLinesById(currentUser: any, cruiseLinesId,data) {
        
        let headers = new Headers();
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.UPDATE_CRUISELINE_BY_ID + '/' + cruiseLinesId;
        return this._http.post(URL,data, options)
            .map((data: any) => {
                return data.json();
            });
    }

    public checkShips(currentUser,cruiseLinesId){
        
        let headers = new Headers();
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.CHECK_SHIP_BY_CRUISEID + '/' + cruiseLinesId;
        return this._http.get(URL, options)
            .map((data: any) => {
                return data.json();
            });
    }

    public checkItirenary(currentUser,cruiseLinesId){
        
        let headers = new Headers();
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.CHECK_ITINERARY_BY_CRUISEID + '/' + cruiseLinesId;
        
        return this._http.get(URL, options)
            .map((data: any) => {
                return data.json();
            });
    }
}