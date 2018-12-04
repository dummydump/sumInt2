/**
 * Trip Services.
 */

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { Http, Response, Headers, Request, RequestOptions, RequestMethod, URLSearchParams } from '@angular/http';
import { GlobalVariable } from '../services/static-variable';
import { HttpClient, HttpRequest, HttpResponse, HttpEventType} from '@angular/common/http';

@Injectable()
export class TaskService {

    constructor(
        public _http: Http,
        public _router: Router,
        private _httpClient: HttpClient) {
    }
   
    public addTask(currentUser: any, task: any, isUpdate: any) {
        
        let body = JSON.stringify(task);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });

        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.ADD_TASK;
        return this._http.post(URL, body, options)
            .map((data: any) => {
                return data.json();
            });
    }
       

    public getTasks(currentUser: any, data) {
        
        let body = JSON.stringify(data);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json' );
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        return this._http.post(GlobalVariable.BASE_API_URL + GlobalVariable.GET_TASKS,data,options)
            .map((data: any) => {
                data.json();
                return data.json();
            });
    }

    public updateTaskById(currentUser: any, task) {
        
        let taskId = task._id;
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);

        let body = JSON.stringify(task);
        let options = new RequestOptions({ headers: headers });
        
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.UPDATE_TASK_BY_ID + '/' + taskId;
        return this._http.post(URL, body, options)
            .map((data: any) => {
                return data.json();
            });
    }
    public removeTaskById(currentUser: any, taskId) {
        
        let headers = new Headers();
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.REMOVE_TASK_BY_ID + '/' + taskId;
        return this._http.post(URL, {}, options)
            .map((data: any) => {
                return data.json();
            });
    }

    public getTasksByRole(currentUser: any, data) {
        
        let body = JSON.stringify(data);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json' );
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        return this._http.post(GlobalVariable.BASE_API_URL + GlobalVariable.GET_TASKS_BY_ROLE,data,options)
            .map((data: any) => {
                data.json();
                return data.json();
            });
    }
}