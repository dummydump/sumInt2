/**
 * Cruise Lines Page Component.
 */
// tslint:disable-next-line:max-line-length
import { Component, ViewChild, NgModule, OnInit, Output, AfterViewInit, EventEmitter, OnDestroy, ElementRef, NgZone, Renderer, Directive, Inject, ViewContainerRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonAppService, UserService,CruiseService } from '../../../../services/index';
import { GlobalVariable } from '../../../../services/static-variable';

@Component({
    providers: [
        CommonAppService,
        UserService,
        CruiseService
    ],
    styleUrls: ['./cruiselines-view.component.css'],
    templateUrl: './cruiselines-view.component.html'
})

export class CruiseLinesViewComponent implements OnInit, AfterViewInit {
    public currentUser: any;
    public cruiselineList = [];
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
    public message ;
    spinnerConfig = {
        bdColor: '#333',
        size: 'large',
        color: '#fff'
    };
    
    constructor(
        public _route: ActivatedRoute,
        public _router: Router,
        public _commonAppService: CommonAppService,
        public _userService: UserService,
        public _viewContainerRef: ViewContainerRef,
        public _cruiseService : CruiseService
    ) {

        this._commonAppService.getCurrentUserSession( (user) => {
            this.currentUser = user;
            if (this._commonAppService.isUndefined(this.currentUser)) {
                window.location.href = '/login';
            }
        });
        this.message =  _route.snapshot.params['msg'];
    }
    

    public ngOnInit() {
        //console.log(this.message);
        
        /*if(!this._commonAppService.isUndefined(this.message))
        {
            this._commonAppService.showSuccessMessage('Alert', this.message, (alertRes) => {});
        }*/
        //this._commonAppService.spinner.show();
        //console.log('refresh from init');
        this.refreshCruiselineList();        
        
    }

    public ngAfterViewInit() {
        this._commonAppService.spinner.hide();
        this._commonAppService.spinner.show();
        setTimeout(() => {
            this._commonAppService.spinner.hide();
        }, 1000);
    }
    
    public currentPageCountEvent($event){
        this.currentPageCount = $event;
        this.getCruiselineList(this.currentPageCount, this.limit);
    }

    public limitChangeEvent($event){
        this.limit = $event;
        this.getCruiselineList(0, this.limit);
    }

    public getCruiselineList(pageCount, limit) {

        //this.currentPageCount = (this.isSearching && this.pgList['pages'] && this.pgList['pages'].length < 2)? 0 : pageCount;
        this.currentPageCount = pageCount;


        let data = { 'pageCount': this.currentPageCount, 'limit': limit };
        data['search'] = this.searchObject;

        if (this.currentSearchKey != '' && this.currentSearchValue != '') {
            data['searchBy'] = this.currentSearchKey;
            data['searchValue'] = this.currentSearchValue;
        }
        
        this._commonAppService.spinner.show();

        this._cruiseService.getAllCruiseLines(this.currentUser, data)
            .subscribe((data: any) => {
                if (data.status == '1') {
                    
                    this.cruiselineList = data.result.cruiselines;
                    this.totalRecords = data.result.totalRecords;
                    let _pList = this._commonAppService.getPagerList(this.totalRecords, this.limit, this.currentPageCount);
                    this.pgList = (_pList) ? _pList : [];
                
                } else {
                    this.cruiselineList = [];
                    this.totalRecords = 0;
                    this.pagerList = [];
                    this.pgList['pages'] = [];
                }
                this._commonAppService.spinner.hide();
            },
            (error: any) => {
                console.log(' Error while getAllTrips :  ' + JSON.stringify(error));
                this._commonAppService.spinner.hide();
            });

        /*setTimeout( ()=> {
            this._commonAppService.spinner.hide();
        }, 1000);*/


    }

    public removeCruiselineById(cruiselineId ) {
        
        this._commonAppService.showConfirmDialog(this._commonAppService.removeConfirmMessage,  (confirmRes) => {
            if (confirmRes == true) {

                // check if ship with this cruiseline id
                this._cruiseService.checkShips(this.currentUser, cruiselineId)
                .subscribe((data1:any)=> {
                    
                
                    if(data1.status == '1')
                    {
                        this._commonAppService.showErrorMessage('Alert', "Ships with this Cruise line Id exists", function (alertRes) { });
                    }
                    else
                    {
                        
                        this._cruiseService.checkItirenary(this.currentUser,cruiselineId)
                        .subscribe((dt:any) => {
                            
                            if(dt.status == '1')
                            {
                                this._commonAppService.showErrorMessage('Alert', "Cruise Itinerary with this Cruise line Id exists", function (alertRes) { });
                            }
                            else
                            {
                                
                                this._commonAppService.spinner.show();
                                this._cruiseService.removeCruiseLinesById(this.currentUser,cruiselineId)
                                    .subscribe((data: any) => {
                                        
                                        if(data.status == true){
                                            this._commonAppService.spinner.hide();
                                            this._commonAppService.showSuccessMessage('Alert', data.result.message, function (alertRes) {
                                            });
                                            
                                            this.refreshCruiselineList(1);
                                        }
                                        else{ 
                                            this._commonAppService.spinner.hide();
                                            this._commonAppService.showErrorMessage('Error', data.result.error, function (alertRes) {
                                            });
                                        }
                                        
                                    },
                                    (error: any) => {
                                        this._commonAppService.spinner.hide();
                                        this._commonAppService.showErrorMessage('Alert', error, function (alertRes) { });
                                    });
                            }
                        })
                    }
                });
                
                
                
            }
        });
    }

    public onSearchChange(searchKey, searchValue) {
        this.checkIsSearching();
        this.currentSearchKey = searchKey;
        this.currentSearchValue = searchValue;
        this.getCruiselineList(this.currentPageCount, this.limit);
    }

    public checkIsSearching() {
        this.isSearching = false;
        for (var i in this.searchObject) {
            if (this.searchObject[i] != '') {
                this.isSearching = true;
            }
        }
    }

    public refreshCruiselineList(rem =0) {

        this.currentSearchKey = '';
        this.currentSearchValue = '';
        this.searchObject = { 'name': '' };
        this.cruiselineList = [];
        this.pageCount = 0;
        this.limit = 10;
        //this.totalRecords = 0;
        //this.currentPageCount = 0;
        if(rem)
        {
            this.totalRecords--;
            if(this.currentPageCount*this.limit == this.totalRecords )
            this.currentPageCount--;
            this.totalRecords = 0;
        }
        this.pagerList = [];
        this.pgList['pages'] = [];
        this.getCruiselineList(this.currentPageCount, this.limit);
    }

    public setPageLimit(option) {
        this.limit = parseInt(option);
        this.getCruiselineList(0, this.limit);
    }

    public addNew()
    {
        this._router.navigate(['/manageCruiselines']);
    }

}
