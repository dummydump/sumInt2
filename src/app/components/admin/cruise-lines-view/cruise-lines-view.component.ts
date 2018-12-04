import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router/';
import { CommonAppService, UserService, CruiseService } from '../../../services/index';

@Component({
  selector: 'app-cruise-lines-view',
  providers: [
    CommonAppService,
    UserService,
    CruiseService,    
],
  templateUrl: './cruise-lines-view.component.html',
  styleUrls: ['./cruise-lines-view.component.css']
})
export class CruiseLinesViewComponent implements OnInit {


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
    public isSpinner = true;
    public cruiseLineList  =[];
 

  constructor(
    public _route: ActivatedRoute,
    public _router: Router,
    public _commonAppService: CommonAppService,
    public _userService: UserService,
    public _cruiseService: CruiseService,
  
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
    this.getCruiseLineList(0,10);
  }

  public getCruiseLineList(pageCount, limit){
        
    this.currentPageCount = (this.isSearching && this.pgList['pages'] && this.pgList['pages'].length < 2)? 0 : pageCount;
    
    let data = { "pageCount": this.currentPageCount, "limit": limit};
    data['search'] = this.searchObject;

    if(this.isSpinner && !this.isSearching)
          this._commonAppService.spinner.show();
    
    this._cruiseService.getAllCruiseLines(this.currentUser, data)
        .subscribe((data: any) => {
            if(data.status == '1'){
                setTimeout(() => {
                    this.cruiseLineList = data.result.cruiselines;
                    this.totalRecords = data.result.totalRecords;
                    let _pList = this._commonAppService.getPagerList(this.totalRecords, this.limit, this.currentPageCount);
                    this.pgList = (_pList) ? _pList : [];
                }, 0);
            } else {
                this.cruiseLineList = [];
                this.totalRecords = 0;
                this.pagerList = [];
                this.pgList['pages'] = [];
            }
            setTimeout(() =>{
                this._commonAppService.spinner.hide();
            },1000); 
            this.isSpinner =true;
        },
        (error: any) => {
            console.log(' Error while gettingCruise :  ' + JSON.stringify(error));
        });

}

public removeCruiseLinesById(userId,pos:number){
        
  this._commonAppService.openConfirmDialog('Confirm', this._commonAppService.removeConfirmMessage, (confirmRes) =>{
      if(confirmRes == true){
          this._cruiseService.removeCruiseLinesById(this.currentUser, userId)
              .subscribe((data: any) => {
                  this._commonAppService.showSuccessMessage('Alert', data.result.message, function(alertRes){
                     
                  });
                  this.totalRecords = this.totalRecords -1;
                  this.cruiseLineList.splice(pos,1);
              },
              (error: any) => {
                  this._commonAppService.showErrorMessage('Alert', error, function(alertRes){});
              });
      }
  });
}


  public onSearchChange(searchKey, searchValue){
    this.checkIsSearching();
    this.getCruiseLineList(0, this.limit);
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
  this.getCruiseLineList(0, this.limit);
  }

}
