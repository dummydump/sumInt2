/**
 * Property Services.
 */

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { Http, Response, Headers, Request, RequestOptions, RequestMethod, URLSearchParams } from '@angular/http';
import { GlobalVariable } from '../services/static-variable';

@Injectable()
export class PropertyService {

    constructor(
        public _http: Http,
        public _router: Router) {
    }
    
    public getAllProperties(currentUser: any, data) {
        
        let body = JSON.stringify(data);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json' );
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.GET_ALL_PROPERTIES;
        return this._http.post(URL, body, options)
            .map((data: any) => {
                return data.json();
            });
    }


    
public removePropertyById(currentUser: any, propertyId) {
       
    let headers = new Headers();
    headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
    let options = new RequestOptions({ headers: headers });
    let URL = GlobalVariable.BASE_API_URL + GlobalVariable.REMOVE_PROPERTY_BY_ID + '/' + propertyId;
    return this._http.post(URL, {}, options)
        .map((data: any) => {
            return data.json();
        });
}
}