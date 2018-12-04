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
export class BookingService {

    constructor(
        public _http: Http,
        public _router: Router) {
    }

   // @Output() initEditBooking: EventEmitter<any> = new EventEmitter();
    //public initEditBooking: EventEmitter<any> = new EventEmitter();
    private _editBookingInfoSource = new BehaviorSubject<any>({});
    // Observable navItem stream
    initEditBooking$ = this._editBookingInfoSource.asObservable();
    editBooking(_bookingInfo) {
        this._editBookingInfoSource.next(_bookingInfo);
    }
   
    public addBooking(currentUser: any, booking: any, isUpdate: any) {
        let THIS = this;
        let body = JSON.stringify(booking);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });

        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.ADD_BOOKING;
        return this._http.post(URL, body, options)
            .map((data: any) => {
                return data.json();
            });
    }
       

    public getBookings(currentUser: any, data) {
        let THIS = this;
        let body = JSON.stringify(data);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json' );
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        return this._http.post(GlobalVariable.BASE_API_URL + GlobalVariable.GET_BOOKINGS,data,options)
            .map((data: any) => {
                data.json();
                return data.json();
            });
    }

    public getAllBookingsByTripId(currentUser: any, data) {
        let THIS = this;
        let body = JSON.stringify(data);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json' );
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        return this._http.post(GlobalVariable.BASE_API_URL + GlobalVariable.GET_ALL_BOOKINGS_BY_TRIPID,data,options)
        .map((data: any) => { 
                data.json();
                return data.json();
            });
    }

    public getPaymentByTripId(currentUser: any, data) {
        let THIS = this;
        let body = JSON.stringify(data);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json' );
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        return this._http.post(GlobalVariable.BASE_API_URL + GlobalVariable.GET_PAYMENTS_BY_TRIPID,data,options)
        .map((data: any) => {
                data.json();
                return data.json();
            });
    }

    public updateBookingById(currentUser: any, booking) {
        let THIS = this;
        let bookingId = booking._id;
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);

        let body = JSON.stringify(booking);
        let options = new RequestOptions({ headers: headers });
        
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.UPDATE_BOOKING_BY_ID + '/' + bookingId;
        return this._http.post(URL, body, options)
            .map((data: any) => {
                return data.json();
            });
    }
    public removeBookingById(currentUser: any, bookingId) {
        let THIS = this;
        let headers = new Headers();
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.REMOVE_BOOKING_BY_ID + '/' + bookingId;
        return this._http.post(URL, {}, options)
            .map((data: any) => {
                return data.json();
            });
    }
}