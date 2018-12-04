import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { Http, Response, Headers, Request, RequestOptions, RequestMethod, URLSearchParams } from '@angular/http';
import { GlobalVariable } from '../services/static-variable';
import { CommonAppService } from '../services/commonapp.service';


@Injectable()
export class CountryService {

  constructor(
    public _http: Http,
    public _router: Router
  ) { }

  public getAllCountries(currentUser: any, data) {
    let headers = new Headers();
    
    let body = JSON.stringify(data);
    headers.append('Content-Type', 'application/json');
    headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);

    let options = new RequestOptions( {headers: headers });
    return this._http.post(GlobalVariable.BASE_API_URL + GlobalVariable.GET_ALL_COUNTRIES, data, options)
        .map((data: any) => {
            data.json();
            return data.json();
        });
}


public getCountryById(currentUser:any,countryId){
  let headers = new Headers();
  headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
  let options = new RequestOptions( {headers: headers });
  return this._http.get(GlobalVariable.BASE_API_URL + GlobalVariable.GET_COUNTRY_BY_ID + '/' + countryId, options)
  .map((data: any) => {
      data.json();
      return data.json();
  });
}

}
