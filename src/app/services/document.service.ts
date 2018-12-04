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
export class DocumentService {

    constructor(
        public _http: Http,
        public _router: Router,
        private _httpClient: HttpClient) {
    }
   
    public addDocument(currentUser: any, document: any, isUpdate: any) {
        
        let body = JSON.stringify(document);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.ADD_DOCUMENT;
        return this._http.post(URL, body, options)
            .map((data: any) => {
                return data.json();
            });
    }
       
    public uploadDocument(currentUser: any, file: any, tripId, isUpdate: any) {
        
        let formData: FormData = new FormData(); 
        formData.append('file', file);
     
        formData.append('token', currentUser.token);
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.UPLOAD_DOCUMENT + '/' + tripId ;
        // return this._http.post(URL, formData,{  reportProgress: true})
        //     .map((data: Response) => {
        //         return data.json();
        //     }); 
        
        const req = new HttpRequest('POST', URL, formData, {
            reportProgress: true
          });
          return this._httpClient.request(req);
        //   .pipe(
        //     map(event => this.getEventMessage(event, file)),
        //     tap(message => this.showProgress(message)),
        //     last(), // return last (completed) message to caller
        //     catchError(this.handleError(file))
        //   );
        //     return this._httpClient.post(URL, formData, {reportProgress: true});

    }

    public getDocuments(currentUser: any, data) {
        
        let body = JSON.stringify(data);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json' );
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        return this._http.post(GlobalVariable.BASE_API_URL + GlobalVariable.GET_DOCUMENTS,data,options)
            .map((data: any) => {
                data.json();
                return data.json();
            });
    }

    
    public updateDocumentById(currentUser: any, document) {
        
        let documentId = document._id;
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
       

        let body = JSON.stringify(document);
        let options = new RequestOptions({ headers: headers });
        
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.UPDATE_DOCUMENT_BY_ID + '/' + documentId;
        return this._http.post(URL, body, options)
            .map((data: any) => {
                return data.json();
            });
    }
    public removeDocumentById(currentUser: any, documentId) {
        
        let headers = new Headers();
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.REMOVE_DOCUMENT_BY_ID + '/' + documentId;
        return this._http.post(URL, {}, options)
            .map((data: any) => {
                return data.json();
            });
    }

    
}