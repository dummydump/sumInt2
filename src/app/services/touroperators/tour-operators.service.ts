/**
 * Trip Services.
 */

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { Http, Response, Headers, Request, RequestOptions, RequestMethod, URLSearchParams } from '@angular/http';
import { GlobalVariable } from '../../services/static-variable';


@Injectable()
export class TourOperatorsService {

    constructor(
        public _http: Http,
        public _router: Router) {
    }
   
 
       

    public getTourOperators(currentUser: any, data) {
        
        let body = JSON.stringify(data);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json' );
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        return this._http.post(GlobalVariable.BASE_API_URL + GlobalVariable.GET_TOUROPERATORS,data,options)
            .map((data: any) => {
                data.json();
                return data.json();
            });
    }


    public removeTourOperatorById(currentUser: any, tourOperatorId) {
       
        let headers = new Headers();
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.REMOVE_TOUROPERATOR_BY_ID + '/' + tourOperatorId;
        return this._http.post(URL, {}, options)
            .map((data: any) => {
                return data.json();
            });
    }

}