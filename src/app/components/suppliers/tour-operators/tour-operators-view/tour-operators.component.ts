/**
 * Tour Operators Page Component.
 */
// tslint:disable-next-line:max-line-length
import { Component, ViewChild, NgModule, OnInit, Output, AfterViewInit, EventEmitter, OnDestroy, ElementRef, NgZone, Renderer, Directive, Inject, ViewContainerRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonAppService, UserService, TourOperatorsService } from '../../../../services/index';
import { GlobalVariable } from '../../../../services/static-variable';

@Component({
    providers: [
        CommonAppService,
        UserService,
        TourOperatorsService
    ],
    styleUrls: ['./tour-operators.component.css'],
    templateUrl: './tour-operators.component.html'
})

export class TourOperatorsComponent implements OnInit, AfterViewInit {
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
    public tourOperatorsList = [];
   

    constructor(
        public _route: ActivatedRoute,
        public _router: Router,
        public _commonAppService: CommonAppService,
        public _userService: UserService,
        public _viewContainerRef: ViewContainerRef,
        public _tourOperatorService: TourOperatorsService,
    ) {
        
        this._commonAppService.getCurrentUserSession( (user)  => {
            this.currentUser = user;
            if (this._commonAppService.isUndefined(this.currentUser)) {
                window.location.href = '/login';
            }
        });
        this.searchObject = {'companyName':''};
    }

    spinnerConfig = {
        bdColor: '#333',
        size: 'large',
        color: '#fff'
    }
    public ngOnInit() {
        this.getTourOperators(0,10);   
    }


    
  public getTourOperators(pageCount, limit){
        
    this.currentPageCount = (this.isSearching && this.pgList['pages'] && this.pgList['pages'].length < 2)? 0 : pageCount;
    
    let data = { "pageCount": this.currentPageCount, "limit": limit};
    data['search'] = this.searchObject;

    if(!this.isSearching)
          this._commonAppService.spinner.show();
    
    this._tourOperatorService.getTourOperators(this.currentUser, data)
        .subscribe((data: any) => {
            if(data.status == '1'){
                setTimeout(() => {
                    this.tourOperatorsList = data.result.tour_operators;
                    this.totalRecords = data.result.totalRecords;
                    let _pList = this._commonAppService.getPagerList(this.totalRecords, this.limit, this.currentPageCount);
                    this.pgList = (_pList) ? _pList : [];
                }, 0);
            } else {
                this.tourOperatorsList = [];
                this.totalRecords = 0;
                this.pagerList = [];
                this.pgList['pages'] = [];
            }
            setTimeout(() =>{
                this._commonAppService.spinner.hide();
            },1000); 
           
        },
        (error: any) => {
            console.log(' Error while gettingTourOprators :  ' + JSON.stringify(error));
        });

}


public onSearchChange(searchKey, searchValue){
    this.checkIsSearching();
    this.getTourOperators(0, this.limit);
  }

  public setPageLimit(option) {
    this.limit = parseInt(option);
    this.getTourOperators(0, this.limit);
    }


  public checkIsSearching(){
      
    this.isSearching = false;
    for (var i in this.searchObject) {
        if(this.searchObject[i] != ''){
            this.isSearching = true;
        }
    }
}


public removeTourOperatorsById(tourOperatorId,pos:number){
        
    this._commonAppService.openConfirmDialog('Confirm', this._commonAppService.removeConfirmMessage, (confirmRes) =>{
        if(confirmRes == true){
            this._tourOperatorService.removeTourOperatorById(this.currentUser, tourOperatorId)
                .subscribe((data: any) => {
                    this._commonAppService.showSuccessMessage('Alert', data.result.message, function(alertRes){
                       
                    });
                    this.totalRecords = this.totalRecords -1;
                    this.tourOperatorsList.splice(pos,1);
                },
                (error: any) => {
                    this._commonAppService.showErrorMessage('Alert', error, function(alertRes){});
                });
        }
    });
  }



    public ngAfterViewInit() {
    }


}
