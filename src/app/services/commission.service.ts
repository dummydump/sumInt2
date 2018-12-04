/**
 * Commission Services.
 */

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { Http, Response, Headers, Request, RequestOptions, RequestMethod, URLSearchParams } from '@angular/http';
import { GlobalVariable } from '../services/static-variable';
import { globalAgent } from 'https';

@Injectable()
export class CommissionService{
    constructor(
        public _http: Http,
        public _router: Router) {
    }

    public getAllChecks(currentUser: any, data) {
        
        let body = JSON.stringify(data);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json' );
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.GET_ALL_CHECKS;
        return this._http.post(URL, body, options)
            .map((data: any) => {
                return data.json();
            }); 
    }

    public addCheck(currentUser: any, data) {
        
        let headers = new Headers();
        headers.append('Content-Type', 'application/json' );
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.ADD_CHECK ;
        return this._http.post(URL, data, options)
            .map((data: any) => {
                return data.json();
            });
    }

    public removeCheckById(currentUser: any, checkId) {
        
        let headers = new Headers();
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.REMOVE_CHECK_BY_ID + '/' + checkId;
        return this._http.get(URL, options)
            .map((data: any) => {
                return data.json();
            });
    }

    public updateCheckById(currentUser: any, data,checkId) {
        
        let headers = new Headers();
        headers.append('Content-Type', 'application/json' );
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.UPDATE_CHECK_BY_ID + '/' + checkId ;
        return this._http.post(URL, data, options)
            .map((data: any) => {
                return data.json();
            });
    }

    public getCheckById(currentUser:any, checkId)
    {
        let headers = new Headers();
        headers.append(GlobalVariable.AUTHORIZATION,currentUser.token);
        let options = new RequestOptions({headers: headers});
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.GET_CHECK_BY_ID + '/' + checkId;
        return this._http.get(URL, options)
            .map((data:any) => {
                return data.json();
            })
    }

    public getAllSuppliers(currentUser: any, data) {
       
        let body = JSON.stringify(data);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json' );
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.GET_ALL_SUPPLIERS;
        return this._http.post(URL, body, options)
            .map((data: any) => {
                return data.json();
            });
    }

    public getPaidBookings(currentUser,checkId)
    {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json' );
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.GET_PAID_BOOKINGS+'/'+checkId;
        return this._http.get(URL, options)
            .map((data: any) => {
                return data.json();
            });

    }

    public addReconciliation(currentUser,data)
    {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json' );
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.ADD_RECONCILIATION;
        return this._http.post(URL,data, options)
            .map((data: any) => {
                return data.json();
            });
    }

    public editReconciliation(currentUser,data)
    {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json' );
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.EDIT_RECONCILIATION;
        return this._http.post(URL,data, options)
            .map((data: any) => {
                return data.json();
            });
    }
}