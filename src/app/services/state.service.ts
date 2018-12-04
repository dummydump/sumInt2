import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { Http, Response, Headers, Request, RequestOptions, RequestMethod, URLSearchParams } from '@angular/http';
import { GlobalVariable } from '../services/static-variable';
import { CommonAppService } from '../services/commonapp.service';


@Injectable()
export class StateService {

  constructor(
    public _http: Http,
    public _router: Router
  ) { }

  public getAllStatesByCountryId(currentUser: any , countryId) {
    let headers = new Headers();
    headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
    let options = new RequestOptions( {headers: headers });
    return this._http.get(GlobalVariable.BASE_API_URL + GlobalVariable.GET_ALL_STATES_BY_COUNTRY_ID + '/' + countryId, options)
        .map((data: any) => {
            data.json();
            return data.json();
        });
}

public getAllStates(currentUser:any,data){

  let headers = new Headers();
  headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
  let options = new RequestOptions( {headers: headers });
  return this._http.get(GlobalVariable.BASE_API_URL + GlobalVariable.GET_ALL_STATES, options)
      .map((data: any) => {
          data.json();
          return data.json();
      });


}


public getStateById(currentUser:any,stateId){

    let headers = new Headers();
    headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
    let options = new RequestOptions( {headers: headers });
    return this._http.get(GlobalVariable.BASE_API_URL + GlobalVariable.GET_STATE_BY_ID + '/' + stateId, options)
        .map((data: any) => {
            data.json();
            return data.json();
        });


}

}
