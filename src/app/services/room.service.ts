/**
 * Room Services.
 */

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { Http, Response, Headers, Request, RequestOptions, RequestMethod, URLSearchParams } from '@angular/http';
import { GlobalVariable } from '../services/static-variable';

@Injectable()
export class RoomService {

    constructor(
        public _http: Http,
        public _router: Router) {
    }

    public addUpdateRoom(currentUser: any, room: any, isUpdate: any) {
       
        let body = JSON.stringify(room);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json' );
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        // tslint:disable-next-line:max-line-length
        let URL = GlobalVariable.BASE_API_URL + ((isUpdate == '') ? GlobalVariable.ADD_ROOM : GlobalVariable.UPDATE_ROOM_BY_ID + '/' + room._id);
        return this._http.post(URL, body, options)
            .map((data: any) => {
                return data.json();
            });
    }

    public getRoomById(currentUser: any, roomId) {
        let headers = new Headers();
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions( {headers: headers });
        return this._http.get(GlobalVariable.BASE_API_URL + GlobalVariable.GET_ROOM_BY_ID + '/' + roomId, options)
            .map((data: any) => {
                data.json();
                return data.json();
            });
    }

    public getAllRooms(currentUser: any, data) {
       
        let body = JSON.stringify(data);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json' );
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.GET_ALL_ROOMS;
        return this._http.post(URL, body, options)
            .map((data: any) => {
                return data.json();
            });
    }
    
    public removeRoomById(currentUser: any, roomId) {
       
        let headers = new Headers();
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions({ headers: headers });
        let URL = GlobalVariable.BASE_API_URL + GlobalVariable.REMOVE_ROOM_BY_ID + '/' + roomId;
        return this._http.post(URL, {}, options)
            .map((data: any) => {
                return data.json();
            });
    }

}