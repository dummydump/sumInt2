/**
 * User Services.
 */

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { Http, Response, Headers, Request, RequestOptions, RequestMethod, URLSearchParams } from '@angular/http';
import { GlobalVariable } from '../services/static-variable';

@Injectable()
export class UserService {

    constructor(
        public _http: Http,
        public _router: Router) {
    }

    public getUserToken(currentUser: any, email: any) {
        let body = { "email": email };
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(GlobalVariable.BASE_API_URL + GlobalVariable.GET_USER_TOKEN, body, options)
            .map((data: any) => {
                data.json();
                return data.json();
            });
    }

    public addUpdateUser(currentUser: any, user: any, isUpdate: any) {
       
        let body = JSON.stringify(user);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json' );
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + ((isUpdate == '') ? GlobalVariable.ADD_USER : GlobalVariable.UPDATE_USER_BY_ID + '/' + user._id);
        return this._http.post(URL, body, options)
            .map((data: any) => {
                return data.json();
            });
    }

    public getUserById(currentUser: any, userId) {
        let headers = new Headers();
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions( {headers: headers });
        return this._http.get(GlobalVariable.BASE_API_URL + GlobalVariable.GET_USER_BY_ID + '/' + userId, options)
            .map((data: any) => {
                data.json();
                return data.json();
            });
    }

    public getAllUsers(currentUser: any, data) {
       
        let body = JSON.stringify(data);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json' );
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.GET_ALL_USERS;
        return this._http.post(URL, body, options)
            .map((data: any) => {
                return data.json();
            });
    }
    
    public getAllAgents(currentUser: any, data) {
       
        let body = JSON.stringify(data);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json' );
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.GET_ALL_AGENTS;
        return this._http.post(URL, body, options)
            .map((data: any) => {
                return data.json();
            });
    }
    
    public removeUserById(currentUser: any, userId) {
       
        let headers = new Headers();
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.REMOVE_USER_BY_ID + '/' + userId;
        return this._http.post(URL, {}, options)
            .map((data: any) => {
                return data.json();
            });
    }

    public getAgentList(currentUser: any, data) {
       
        let body = JSON.stringify(data);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json' );
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.GET_ALL_USERS;
        return this._http.post(URL, body, options)
            .map((data: any) => {
                return data.json();
            });
    }
}