/**
 * Trip Services.
 */

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { Http, Response, Headers, Request, RequestOptions, RequestMethod, URLSearchParams } from '@angular/http';
import { GlobalVariable } from '../services/static-variable';

@Injectable()
export class PaymentService {

    constructor(
        public _http: Http,
        public _router: Router) {
    }
   
    public addPayment(currentUser: any, payment: any) {
        
        let body = JSON.stringify(payment);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });

        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.ADD_PAYMENT;
        return this._http.post(URL, body, options)
            .map((data: any) => {
                return data.json();
            });
    }
       

    public getPayments(currentUser: any, data) {
        
        let body = JSON.stringify(data);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json' );
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        return this._http.post(GlobalVariable.BASE_API_URL + GlobalVariable.GET_PAYMENTS,data,options)
            .map((data: any) => {
                data.json();
                return data.json();
            });
    }

    public updatePaymentById(currentUser: any, payment) {
        
        let taskId = payment._id;
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);

        let body = JSON.stringify(payment);
        let options = new RequestOptions({ headers: headers });
        
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.UPDATE_PAYMENT_BY_ID + '/' + taskId;
        return this._http.post(URL, body, options)
            .map((data: any) => {
                return data.json();
            });
    }
    public removePaymentById(currentUser: any, paymentId) {
        
        let headers = new Headers();
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.REMOVE_PAYMENT_BY_ID + '/' + paymentId;
        return this._http.post(URL, {}, options)
            .map((data: any) => {
                return data.json();
            });
    } 

    public getAllBookingWithPayments(currentUser: any, data) {
        let body = JSON.stringify(data);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json' );
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        return this._http.post(GlobalVariable.BASE_API_URL + GlobalVariable.GET_ALL_BOOKINGS_WITH_PAYMENTS,data,options)
            .map((data: any) => {
                data.json();
                return data.json();
            });
    }
}