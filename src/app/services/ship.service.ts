import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { Http, Response, Headers, Request, RequestOptions, RequestMethod, URLSearchParams } from '@angular/http';
import { GlobalVariable } from '../services/static-variable';
import { CommonAppService } from '../services/commonapp.service';


@Injectable()
export class ShipService {

  constructor(
        public _http: Http,
        public _commonAppService: CommonAppService,
        public _router: Router
  ) { }



  public addUpdateShip(currentUser: any, ship: any, isUpdate: any) {
       
    let body = JSON.stringify(ship);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json' );
    headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
    let options = new RequestOptions({ headers: headers });
    let URL = GlobalVariable.BASE_API_URL + ((isUpdate == '') ? GlobalVariable.ADD_SHIP : GlobalVariable.UPDATE_SHIP_BY_ID + '/' + ship._id);
    return this._http.post(URL, body, options)
        .map((data: any) => {
            return data.json();
        });
}

  public getShips(currentUser: any, data) {
    let headers = new Headers();
    
    let body = JSON.stringify(data);
    headers.append('Content-Type', 'application/json');
    headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);

    let options = new RequestOptions( {headers: headers });
    return this._http.post(GlobalVariable.BASE_API_URL + GlobalVariable.GET_ALL_SHIPS, data, options)
        .map((data: any) => {
            data.json();
            return data.json();
        });
}


public getShipById(currentUser: any, shipId) {
    let headers = new Headers();

    let data = {};

    let body = JSON.stringify(data);
    headers.append('Content-Type', 'application/json');
    headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);

    let options = new RequestOptions( {headers: headers });
    return this._http.get(GlobalVariable.BASE_API_URL + GlobalVariable.GET_SHIP_BY_ID + '/' + shipId, options)
        .map((data: any) => {
            data.json();
            return data.json();
        });
}



public removeShipById(currentUser: any, shipId) {
       
    let headers = new Headers();
    headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
    let options = new RequestOptions({ headers: headers });
    let URL = GlobalVariable.BASE_API_URL + GlobalVariable.REMOVE_SHIP_BY_ID + '/' + shipId;
    return this._http.post(URL, {}, options)
        .map((data: any) => {
            return data.json();
        });
}

public listShipsByIds(currentUser: any, data) {
    let headers = new Headers();
    
    let body = JSON.stringify(data);
    headers.append('Content-Type', 'application/json');
    headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);

    let options = new RequestOptions( {headers: headers });
    return this._http.post(GlobalVariable.BASE_API_URL + GlobalVariable.GET_SHIPS_BY_IDS, data, options)
        .map((data: any) => {
            data.json();
            return data.json();
        });
}

}
