import { Component, OnInit } from '@angular/core';
import { PortService } from '../../../services/port.service';
import { UserService, CommonAppService } from '../../../services/index';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CountryService } from '../../../services/country.service';
import {StateService} from '../../../services/state.service';
import {CityService} from '../../../services/city.service';

@Component({
  selector: 'app-port-view',
  providers: [
    CommonAppService,
    UserService,
    PortService,
    CountryService,
    StateService,
    CityService
],
  templateUrl: './port-view.component.html',
  styleUrls: ['./port-view.component.css']
})
export class PortViewComponent implements OnInit {

  public currentUser: any;
  public pageCount = 0;
  public limit = 10;
  public totalRecords = 0;
  public currentPageCount = 0;
  public pagerList = [];
  public currentSearchKey = '';
  public currentSearchValue = '';
  public searchObject = {};
  public isSearching = false;
  public pgList = {};
  public portList = [];
  public cities = [];
  public countries = [];
  public states = [];

  constructor(
    public _route: ActivatedRoute,
    public _router: Router,
    public _commonAppService: CommonAppService,
    public _userService: UserService,
    public _portService : PortService,
     public _countryService: CountryService,
    public _stateService:StateService,
    public _cityService:CityService
  ) {
      
    _commonAppService.getCurrentUserSession( (user) => {
      this.currentUser = user;
    
      if (_commonAppService.isUndefined(this.currentUser)) {
          window.location.href = '/login';
      } else if(!_commonAppService.isManagerOrAdmin(this.currentUser.user.roleName)){
          window.location.href = '/dashboard';
      }
  });
  
  this.searchObject = {'name': ''};
   }



  spinnerConfig = {
    bdColor: '#333',
    size: 'large',
    color: '#fff'
}

ngOnInit() {
  
    this.getAllStates();
    this.getAllCountries();
    this.getPortList(0,10);
    
}

public getPortList(pageCount, limit){
      
  this.currentPageCount = (this.isSearching && this.pgList['pages'] && this.pgList['pages'].length < 2)? 0 : pageCount;
  
  let data = { "pageCount": this.currentPageCount, "limit": limit};
  data['search'] = this.searchObject;

  if(!this.isSearching)
        this._commonAppService.spinner.show();
  
  this._portService.getAllPorts(this.currentUser, data)
      .subscribe((data: any) => {
          if(data.status == '1'){
              setTimeout(() => {
                  this.mapCountryStateCity(data);
                   console.log(data.result);
                  this.portList = data.result.ports;
                  this.totalRecords = data.result.totalRecords;
                  let _pList = this._commonAppService.getPagerList(this.totalRecords, this.limit, this.currentPageCount);
                  this.pgList = (_pList) ? _pList : [];
              }, 0);
          } else {
              this.portList = [];
              this.totalRecords = 0;
              this.pagerList = [];
              this.pgList['pages'] = [];
          }
          setTimeout(() =>{
              this._commonAppService.spinner.hide();
          },1000); 
         
      },
      (error: any) => {
          console.log(' Error while gettingPort :  ' + JSON.stringify(error));
      });

}

public removePortById(portId,pos:number){
        
    this._commonAppService.showConfirmDialog('This action will remove port.', (confirmRes) => {
      if(confirmRes == true){
          this._portService.removePortById(this.currentUser, portId)
              .subscribe((data: any) => {
                  this._commonAppService.showSuccessMessage('Alert', data.result.message, function(alertRes){
                     
                  });
                  this.totalRecords = this.totalRecords -1;
                  this.portList.splice(pos,1);
              },
              (error: any) => {
                  this._commonAppService.showErrorMessage('Alert', error, function(alertRes){});
              });
      }
  });
}



  public onSearchChange(searchKey, searchValue){
    this.checkIsSearching();
    this.getPortList(0, this.limit);
  }


  public checkIsSearching(){
      
    this.isSearching = false;
    for (var i in this.searchObject) {
        if(this.searchObject[i] != ''){
            this.isSearching = true;
        }
    }
  }

  public setPageLimit(option) {
  this.limit = parseInt(option);
  this.getPortList(0, this.limit);
  }

  public refreshPortList(){
      
    this.currentSearchKey = '';
    this.currentSearchValue = '';
    this.searchObject = {'name': ''};
    this.portList = [];
    this.pageCount = 0;
    this.limit = 10;
    this.totalRecords = 0;
    this.currentPageCount = 0;
    this.pagerList = [];
    this.pgList['pages'] = [];
    this.getPortList(0, this.limit);
  }

 


public getAllCountries(){

    var data = {};
         this._countryService.getAllCountries(this.currentUser,data)
         .subscribe(data => {

          
            this.countries = data.result.countries;


         })
}

public getAllStates(){

    var data = {};

    this._stateService.getAllStates(this.currentUser,data)
    .subscribe(data => {

            this.states = data.result.states;


    })


}

public mapCountryStateCity(data: any){
  data.result.ports.forEach((port) => {
    
        data.result.states.forEach((state) => {
              if(port.state === state._id){
                  port.state = state.stateName;
              }
        });

        data.result.countries.forEach((country) => {
            if(port.country === country._id){
                port.country = country.countryName;
            }
        });

        data.result.cities.forEach((city) => {

            if(port.city === city._id){
              port.city = city.cityName;
            }

        });
  });
}


}
