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
export class ClientService {

    constructor(
        public _http: Http,
        public _commonAppService: CommonAppService,
        public _router: Router) {
    }
    public makeCaptiliaze(param) {
        let code = param.charCodeAt(0);
        let capital = String.fromCharCode(code).toUpperCase();
        let param_split = param.split('');
        param_split[0] = capital;
        return param_split.join('');
        }

public addUpdateClient(currentUser: any, client: any, isUpdate:any,editContactIndex:any)
{        client["editContactIndex"]=editContactIndex;
        let body = JSON.stringify(client);
        let bodyParsed = JSON.parse(body);
        bodyParsed.firstName = this.makeCaptiliaze(bodyParsed.firstName);
        bodyParsed.lastName = this.makeCaptiliaze(bodyParsed.lastName);
        body = JSON.stringify(bodyParsed);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json' );
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + ((isUpdate == '') ? GlobalVariable.ADD_CLIENT : GlobalVariable.UPDATE_CLIENT_BY_ID + '/' + client._id);

        return this._http.post(URL, body, options)
        .map((data: any) => {
            return data.json();
        });
    }

    public getClientById(currentUser: any, clientId) {
        let headers = new Headers();

        let data = {};
        data['userId'] = this._commonAppService.getCurrentUserId(currentUser);
        data['roleName'] = this._commonAppService.getCurrentUserRole(currentUser);

        let body = JSON.stringify(data);
        headers.append('Content-Type', 'application/json');
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);

        let options = new RequestOptions( {headers: headers });
        return this._http.post(GlobalVariable.BASE_API_URL + GlobalVariable.GET_CLIENT_BY_ID + '/' + clientId, data, options)
            .map((data: any) => {
                data.json();
                return data.json();
            });
    }
    public increaseTripCounterByClientId(currentUser: any, clientId){
        let data = {};
        data['userId'] = this._commonAppService.getCurrentUserId(currentUser);
        data['roleName'] = this._commonAppService.getCurrentUserRole(currentUser);
        
        let body =JSON.stringify(data);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json' );
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers : headers});
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.INCREASE_TRIP_COUNT + '/' + clientId;
        return this._http.post(URL, data, options)
        .map((data1: any)=>{
            return data1.json();
        });
    }

    public decreaseTripCountersByClientIds(currentUser: any, travellerIds: any) {
        let data = {};
        data['travellerIds']=travellerIds;
        
        let body = JSON.stringify(data);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json' );
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.DECREASE_TRIPS_COUNT;
        return this._http.post(URL, body, options)
            .map((data: any) => {
                return data.json();
            });
    }

    public getClients(currentUser: any, data) {
        
        data['userId'] = this._commonAppService.getCurrentUserId(currentUser);
        data['roleName'] = this._commonAppService.getCurrentUserRole(currentUser);
        let body = JSON.stringify(data);

        let headers = new Headers();
        headers.append('Content-Type', 'application/json' );
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.GET_CLIENTS;
        return this._http.post(URL, body, options)
            .map((data: any) => {
                return data.json();
            });
    }
    
    public getAllClients(currentUser: any, data) {
        
        //data['userId'] = this._commonAppService.getCurrentUserId(currentUser);
        data['roleName'] = this._commonAppService.getCurrentUserRole(currentUser);
        
        let body = JSON.stringify(data);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json' );
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.GET_ALL_CLIENTS;
        return this._http.post(URL, body, options)
            .map((data: any) => {
                return data.json();
            });
    }
    
    public removeClientById(currentUser: any, clientId) {
        
        let headers = new Headers();
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.REMOVE_CLIENT_BY_ID + '/' + clientId;
        return this._http.post(URL, {}, options)
            .map((data: any) => {
                return data.json();
            });
    }
    
    public importClient(currentUser: any, file, ext) {
        

        let formData: FormData = new FormData(); 

        formData.append('agentId', (currentUser)? currentUser.user._id : "");
        formData.append('agentFirstName', (currentUser)? currentUser.user.firstName : "");
        formData.append('agentLastName', (currentUser)? currentUser.user.lastName : "");
        formData.append('file', file);
        formData.append('ext', ext);
        formData.append('token', currentUser.token);
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.IMPORT_CLIENT;
        return this._http.post(URL, formData)
            .map((data: Response) => {
                return data.json();
            }); 
    }

    
    public addAndUpdateRelation(currentUser: any, relation, relativeId) {
        
        let body = JSON.stringify(relation);
        let headers = new Headers();
        let URL:string;
        headers.append('Content-Type', 'application/json' );
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        
        if (relativeId == null) {
             URL = GlobalVariable.BASE_API_URL + GlobalVariable.ADD_RELATION;
        } else {
             URL = GlobalVariable.BASE_API_URL +  GlobalVariable.UPDATE_RELATION_BY_ID + '/' + relativeId;
        }
        return this._http.post(URL, body, options)
            .map((data: any) => {
                return data.json();
            });
    }
    public getRelations(currentUser: any, clientId) {
        
        let data = {'clientId': clientId};
        let body = JSON.stringify(data);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json' );
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.GET_RELATIONS_BY_CLIENTID;
        return this._http.post(URL, body, options)
            .map((data: any) => {
                return data.json();
            });
    }

    public deleteRelation(currentUser:any, relativeId) {
        
        let data = {'relativeId': relativeId};
        let body = JSON.stringify(data);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json' );
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.REMOVE_RELATIVE_BY_ID + '/' + relativeId;
        return this._http.post(URL, body, options)
            .map((data: any) => {
                return data.json();
            });
    }
    public getTripsByClientId(currentUser: any, clientId) {

        
        let data = {'clientId': clientId};
        let body = JSON.stringify(data);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json' );
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.GET_TRIPS_BY_CLIENT_ID  + '/' + clientId;
        return this._http.post(URL, body, options)
            .map((data: any) => {
                return data.json();
            });

    }
    
   
    public downloadError(result) {

        // 
        // let data = {'data': result};
        // let body = JSON.stringify(data);
        // let headers = new Headers();
        // headers.append('Content-Type', 'application/json' );
        // headers.append(GlobalVariable.AUTHORIZATION, GlobalVariable.TOKEN);
        // let options = new RequestOptions({ headers: headers });
        // let URL = GlobalVariable.BASE_API_URL + "api/client/downloadFile";
        // return this._http.post(URL, body, options)
        //     .map((data: any) => {
                
        //     });

    }

}