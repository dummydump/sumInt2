/**
 * Trip Services.
 */

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { Http, Response, Headers, Request, RequestOptions, RequestMethod, URLSearchParams } from '@angular/http';
import { GlobalVariable } from '../services/static-variable';


@Injectable()
export class NotesService {

    constructor(
        public _http: Http,
        public _router: Router) {
    }
   
    public addNote(currentUser: any, note: any, isUpdate: any) {
       
        let body = JSON.stringify(note);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });

        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.ADD_NOTE;
        return this._http.post(URL, body, options)
            .map((data: any) => {
                return data.json();
            });
    }
       

    public getNotes(currentUser: any, data) {
       
        let body = JSON.stringify(data);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json' );
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        return this._http.post(GlobalVariable.BASE_API_URL + GlobalVariable.GET_NOTES,data,options)
            .map((data: any) => {
                data.json();
                return data.json();
            });
    }

    public updateNoteById(currentUser: any, note) {
       
        let noteId = note._id;
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);

        let body = JSON.stringify(note);
        let options = new RequestOptions({ headers: headers });
        
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.UPDATE_NOTE_BY_ID + '/' + noteId;
        return this._http.post(URL, body, options)
            .map((data: any) => {
                return data.json();
            });
    }
    public removeNoteById(currentUser: any, noteId) {
       
        let headers = new Headers();
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.REMOVE_NOTE_BY_ID + '/' + noteId;
        return this._http.post(URL, {}, options)
            .map((data: any) => {
                return data.json();
            });
    }
}