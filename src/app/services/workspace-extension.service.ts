/**
 * Workspace Extension Services.
 */

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { Http, Response, Headers, Request, RequestOptions, RequestMethod, URLSearchParams } from '@angular/http';
import { GlobalVariable } from '../services/static-variable';

@Injectable()
export class WorkspaceExtensionsService {

    constructor(
        public _http: Http,
        public _router: Router) {
    }
   
    public addWorkspaceExtension(currentUser: any, workspaceExtension: any, isUpdate: any) {
       
        let body = JSON.stringify(workspaceExtension);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });

        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.ADD_WORKSPACE_EXTENSION;
        return this._http.post(URL, body, options)
            .map((data: any) => {
                return data.json();
            });
    }

    public getWorkspaceExtensionByClientId(currentUser: any, clientId) {

        let headers = new Headers();
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        return this._http.get(GlobalVariable.BASE_API_URL + GlobalVariable.GET_WORKSPACE_EXTENSION_BY_CLIENT_ID + '/' + clientId, options)
            .map((data: any) => {
                data.json();
                return data.json();
            });
    }
       

    public getWorkspaceExtensions(currentUser: any, data) {
       
        let body = JSON.stringify(data);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json' );
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        return this._http.post(GlobalVariable.BASE_API_URL + GlobalVariable.GET_WORKSPACE_EXTENSIONS,data,options)
            .map((data: any) => {
                data.json();
                return data.json();
            });
    }

    public addUpdateWorkspaceExtension(currentUser: any, workspaceExtension: any, workspaceExtensionId:any) {
       
        let body = JSON.stringify(workspaceExtension);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json' );
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });

        let URL = GlobalVariable.BASE_API_URL + ((!workspaceExtensionId) ? GlobalVariable.ADD_WORKSPACE_EXTENSION : GlobalVariable.UPDATE_WORKSPACE_EXTENSION_BY_ID + '/' + workspaceExtensionId);
        return this._http.post(URL, body, options)
            .map((data: any) => {
                return data.json();
            });
    }


    public removeWorkspaceExtensionById(currentUser: any, workspaceExtensionId) {
       
        let headers = new Headers();
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.REMOVE_WORKSPACE_EXTENSION_BY_ID + '/' + workspaceExtensionId;
        return this._http.post(URL, {}, options)
            .map((data: any) => {
                return data.json();
            });
    }
}