import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { Http, Response, Headers, Request, RequestOptions, RequestMethod, URLSearchParams } from '@angular/http';
import { GlobalVariable } from '../services/static-variable';
import { CommonAppService } from '../services/commonapp.service';


@Injectable()
export class CityService {

  constructor(
    public _http: Http,
    public _router: Router
  ) { }

  public getAllCitiesByStateId(currentUser: any , stateId) {
    let headers = new Headers();
    headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
    let options = new RequestOptions( {headers: headers });
    return this._http.get(GlobalVariable.BASE_API_URL + GlobalVariable.GET_ALL_CITIES_BY_STATE_ID + '/' + stateId, options)
        .map((data: any) => {
            data.json();
            return data.json();
        });
}


    public getAllCities(currentUser: any){
      

       let headers = new Headers();
    headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
    let options = new RequestOptions( {headers: headers });
    return this._http.get(GlobalVariable.BASE_API_URL + GlobalVariable.GET_ALL_CITIES, options)
        .map((data: any) => {

                data.json();
                return data.json();


        })


    }


    public getCityById(currentUser:any, cityId){
        let headers = new Headers();
        headers.append(GlobalVariable.AUTHORIZATION, currentUser.token);
        let options = new RequestOptions( {headers: headers });
        return this._http.get(GlobalVariable.BASE_API_URL + GlobalVariable.GET_CITY_BY_ID + '/' + cityId, options)
        .map((data: any) => {
            data.json();
            return data.json();
        });

    }

}
