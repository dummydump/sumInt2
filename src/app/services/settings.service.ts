/**
 * Trip Services.
 */

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { Http, Response, Headers, Request, RequestOptions, RequestMethod, URLSearchParams } from '@angular/http';
import { GlobalVariable } from '../services/static-variable';
import { HttpClient, HttpRequest, HttpResponse, HttpEventType } from '@angular/common/http';

@Injectable()
export class SettingsService {

    constructor(
        public _http: Http,
        public _router: Router,
        private _httpClient: HttpClient) {
    }


    public getSettingByKey(currentUser: any, data) {
    //    Query object is being made at Backend Side
        let body = JSON.stringify(data);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json' );
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        return this._http.post(GlobalVariable.BASE_API_URL + GlobalVariable.GET_SETTING_BY_KEY,data,options)
            .map((data: any) => {
                data.json();
                return data.json();
            });
    }

}