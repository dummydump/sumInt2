/**
 * Google Calendar Events Services.
 */

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { Http, Response, Headers, Request, RequestOptions, RequestMethod, URLSearchParams } from '@angular/http';
import { GlobalVariable } from '../services/static-variable';


@Injectable()
export class GoogleCalendarEventsService {

    constructor(
        public _http: Http,
        public _router: Router) {
    }


    public getGoogleCalendarEvents(currentUser: any, data) {

        let body = JSON.stringify(data);
        console.log(' body ', body);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        return this._http.post(GlobalVariable.BASE_API_URL + GlobalVariable.GET_GOOGLE_CALENDAR_EVENTS, data, options)
            .map((data: any) => {
                data.json();
                return data.json();
            });
    }

    public addEditGoogleCalendarEvent(currentUser: any, event: any, isUpdate: any) {
        let eventId = event.googleCalendarEventId;
        let body = JSON.stringify(event);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + (!(isUpdate) ? GlobalVariable.ADD_GOOGLE_CALENDAR_EVENT : GlobalVariable.EDIT_GOOGLE_CALENDAR_EVENT_BY_ID + '/' + eventId);

        return this._http.post(URL, body, options)
            .map((data: any) => {
                return data.json();
            });
    }

    public pushNotification(){
        let body = {
            "id": "01234567-89ab-cdef-0123456789ab",  
            "type": "web_hook",
            "address": "https://developmentcupcrm.appspot.com/notifications"
        };
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ya29.c.ElnuBaivJ3hGHySjk6cN8ykywPBgLjRMsLzzskpVilEz7DsVm2SyPKv6U9s5HKCwa6yF3qep4xYRcaAtxtHfgL3hII501mEgy0EinlFzxXPNqXmELnuCVlT3eg');
        let options = new RequestOptions({ headers: headers });
        let URL = 'https://www.googleapis.com/calendar/v3/calendars/dev.team@jstigers.com/events/watch';

        return this._http.post(URL, body, options)
            .map((data: any) => {
                return data.json();
            });
    }

}