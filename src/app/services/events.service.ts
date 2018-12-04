/**
 * Events Services.
 */

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { Http, Response, Headers, Request, RequestOptions, RequestMethod, URLSearchParams } from '@angular/http';
import { GlobalVariable } from '../services/static-variable';


@Injectable()
export class EventsService {

    constructor(
        public _http: Http,
        public _router: Router) {
    }

    public addEditEvent(currentUser: any, event: any, isUpdate: any) {
        let eventId = event._id;
        let body = JSON.stringify(event);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + (!(isUpdate) ? GlobalVariable.ADD_EVENT : GlobalVariable.UPDATE_EVENT_BY_ID + '/' + eventId);

        return this._http.post(URL, body, options)
            .map((data: any) => {
                return data.json();
            });
    }


    public getEvents(currentUser: any, data) {

        let body = JSON.stringify(data);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        return this._http.post(GlobalVariable.BASE_API_URL + GlobalVariable.GET_EVENTS, data, options)
            .map((data: any) => {
                data.json();
                return data.json();
            });
    }

    public getEventById(currentUser: any, data) {
        let body = JSON.stringify(data);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        return this._http.post(GlobalVariable.BASE_API_URL + GlobalVariable.GET_EVENT_BY_ID, data, options)
            .map((data: any) => {
                data.json();
                return data.json();
            });
    }

    public getEventTripById(currentUser: any, tripId, flage) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);

        let options = new RequestOptions({ headers: headers });
        return this._http.get(GlobalVariable.BASE_API_URL + GlobalVariable.GET_EVENT_BY_TRIPID + '/' + tripId + '--' + flage, options)
            .map((data: any) => {
                data.json();
                return data.json();
            });
    }

    public getEventTaskById(currentUser: any, tripId, taskId, flage) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let obj = {
            "tripId": tripId,
            "taskId": taskId,
            "type": flage
        }
        let options = new RequestOptions({ headers: headers });
        return this._http.post(GlobalVariable.BASE_API_URL + GlobalVariable.GET_EVENT_BY_TASKID, obj, options)
            .map((data: any) => {
                data.json();
                return data.json();
            });
    }

    // public updateEventById(currentUser: any, event) {
    //     let eventId = event._id;
    //     let headers = new Headers();
    //     headers.append('Content-Type', 'application/json');
    //     headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);

    //     let body = JSON.stringify(event);
    //     let options = new RequestOptions({ headers: headers });

    //     let URL = GlobalVariable.BASE_API_URL + GlobalVariable.UPDATE_EVENT_BY_ID + '/' + eventId;
    //     return this._http.post(URL, body, options)
    //         .map((data: any) => {
    //             return data.json();
    //         });
    // }

    public removeEventById(currentUser: any, eventId) {

        let headers = new Headers();
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.REMOVE_EVENT_BY_ID + '/' + eventId;
        return this._http.post(URL, {}, options)
            .map((data: any) => {
                return data.json();
            });
    }

    public removeEventByTripId(currentUser: any, tripId) {

        let headers = new Headers();
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.REMOVE_EVENT_BY_TRIPID + '/' + tripId;
        return this._http.post(URL, {}, options)
            .map((data: any) => {
                return data.json();
            });
    }




}