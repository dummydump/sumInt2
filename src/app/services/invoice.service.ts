/**
 * Trip Services.
 */

import { Injectable,Output,EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { Http, Response, Headers, Request, RequestOptions, RequestMethod, URLSearchParams } from '@angular/http';
import { GlobalVariable } from '../services/static-variable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class InvoiceService {

    constructor(
        public _http: Http,
        public _router: Router) {
    }

    // add new invoice number to trip   
    public addInvoice(currentUser: any, invoice: any, isUpdate: any) {
        //console.log('addInvoice');
        //console.log(invoice);
        let THIS = this;
        let body = JSON.stringify(invoice);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.ADD_INVOICE;
        return this._http.post(URL, body, options)
            .map((data: any) => {
                return data.json();
            });
    }
       
    // get invoice number if it is already assigned
    public getInvoiceByTripId(currentUser: any, data) {
        //console.log('in getInvoiceById');
        let THIS = this;
        let body = JSON.stringify(data);
        let tripId = data;
        let headers = new Headers();
        headers.append('Content-Type', 'application/json' );
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        return this._http.get(GlobalVariable.BASE_API_URL + GlobalVariable.GET_INVOICE_BY_TRIPID+'/'+tripId, options)
        .map((data: any) => { 
                data.json();
                return data.json();
            });
    }

}