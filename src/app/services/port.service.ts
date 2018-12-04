/**
 * Client Services.
 */

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { Http, Response, Headers, Request, RequestOptions, RequestMethod, URLSearchParams } from '@angular/http';
import { GlobalVariable } from '../services/static-variable';
import { ClientAddComponent } from '../components/clients/client-add/client-add.component';
import { CommonAppService } from '../services/commonapp.service';


@Injectable()
export class PortService {

    constructor(
        public _http: Http,
        public _commonAppService: CommonAppService,
        public _router: Router) {
    }

    public getAllPorts(currentUser: any, data) {
       
        let body = JSON.stringify(data);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json' );
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.GET_ALL_PORTS;
        return this._http.post(URL, body, options)
            .map((data: any) => {
                return data.json();
            });
    }

    
  public addUpdatePort(currentUser: any, port: any, isUpdate: any) {
       
    let body = JSON.stringify(port);
    console.log(body);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json' );
    headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
    let options = new RequestOptions({ headers: headers });
    let URL = GlobalVariable.BASE_API_URL + ((isUpdate == '') ? GlobalVariable.ADD_PORT : GlobalVariable.UPDATE_PORT_BY_ID + '/' + port._id);
    return this._http.post(URL, body, options)
        .map((data: any) => {
            return data.json();
        }); 
}


    public removePortById(currentUser: any, portId) {
       
        let headers = new Headers();
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.REMOVE_PORT_BY_ID + '/' + portId;
        return this._http.post(URL, {}, options)
            .map((data: any) => {
                return data.json();
            });
    }

    public listPortsByIds(currentUser: any, data) {
       
        let body = JSON.stringify(data);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json' );
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.GET_PORTS_BY_IDS;
        return this._http.post(URL, body, options)
            .map((data: any) => {
                return data.json();
            });
    }

    
public getPortById(currentUser: any, portId) {
    let headers = new Headers();

    let data = {};

    let body = JSON.stringify(data);
    headers.append('Content-Type', 'application/json');
    headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);

    let options = new RequestOptions( {headers: headers });
    return this._http.get(GlobalVariable.BASE_API_URL + GlobalVariable.GET_PORT_BY_ID + '/' + portId, options)
        .map((data: any) => {
            data.json();
            return data.json();
        });
}


}