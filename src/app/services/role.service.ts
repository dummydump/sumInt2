/**
 * Role Services.
 */

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { Http, Response, Headers, Request, RequestOptions, RequestMethod, URLSearchParams } from '@angular/http';
import { GlobalVariable } from '../services/static-variable';

@Injectable()
export class RoleService {

    constructor(
        public _http: Http,
        public _router: Router) {
    }

    public addUpdateRole(currentUser: any, role: any, isUpdate: any) {
       
        let body = JSON.stringify(role);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json' );
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        // tslint:disable-next-line:max-line-length
        let URL = GlobalVariable.BASE_API_URL + ((isUpdate == '') ? GlobalVariable.ADD_ROLE : GlobalVariable.UPDATE_ROLE_BY_ID + '/' + role._id);
        return this._http.post(URL, body, options)
            .map((data: any) => {
                return data.json();
            });
    }

    public getRoleById(currentUser: any, roleId) {
        let headers = new Headers();
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions( {headers: headers });
        return this._http.get(GlobalVariable.BASE_API_URL + GlobalVariable.GET_ROLE_BY_ID + '/' + roleId, options)
            .map((data: any) => {
                data.json();
                return data.json();
            });
    }

    public getRoles(currentUser: any, data) {
       
        let body = JSON.stringify(data);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json' );
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.GET_ROLES;
        return this._http.post(URL, body, options)
            .map((data: any) => {
                return data.json();
            });
    }
    
    public removeRoleById(currentUser: any, roleId) {
       
        let headers = new Headers();
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.REMOVE_ROLE_BY_ID + '/' + roleId;
        return this._http.post(URL, {}, options)
            .map((data: any) => {
                return data.json();
            });
    }
}