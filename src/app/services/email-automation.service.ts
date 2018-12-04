/**
 * Email Automation Services.
 */

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { Http, Response, Headers, Request, RequestOptions, RequestMethod, URLSearchParams } from '@angular/http';
import { GlobalVariable } from '../services/static-variable';

@Injectable()
export class EmailAutomationService {

    constructor(
        public _http: Http,
        public _router: Router) {
    }

    public getEmailAutomation(currentUser: any, data) {
       
        let body = JSON.stringify(data);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json' );
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        return this._http.post(GlobalVariable.BASE_API_URL + GlobalVariable.GET_EMAIL_AUTOMATIONS,data,options)
            .map((data: any) => {
                data.json();
                return data.json();
            });
    }

    public addUpdateEmailAutomation(currentUser: any, emailAutomation: any, emailAutomationId:any) {
       
        let body = JSON.stringify(emailAutomation);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json' );
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });

        let URL = GlobalVariable.BASE_API_URL + ((!emailAutomationId) ? GlobalVariable.ADD_EMAIL_AUTOMATION : GlobalVariable.UPDATE_EMAIL_AUTOMATION_BY_ID + '/' + emailAutomationId);
        return this._http.post(URL, body, options)
            .map((data: any) => {
                return data.json();
            });
    }
    
    public getEmailAutomationByWorkspaceExtIds(currentUser: any, workspaceExtensionIds:any) {
       
        let body = JSON.stringify(workspaceExtensionIds);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json' );
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });

        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.GET_EMAIL_AUTOMATION_BY_WORK_EXT_ID;
        return this._http.post(URL, body, options)
            .map((data: any) => {
                return data.json();
            });
    }


    public removeEmailAutomationByWorkExtId(currentUser: any, workspaceExtensionId) {
       
        let headers = new Headers();
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.REMOVE_EMAIL_AUTOMATION_BY_WORK_EXT_ID + '/' + workspaceExtensionId;
        return this._http.post(URL, {}, options)
            .map((data: any) => {
                return data.json();
            });
    }
}