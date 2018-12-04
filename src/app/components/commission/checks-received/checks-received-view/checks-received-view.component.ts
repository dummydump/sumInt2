/**
 * Checks Received Page Component.
 */
import { Component, ViewChild, NgModule, OnInit, Output, AfterViewInit, EventEmitter, OnDestroy, ElementRef, NgZone, Renderer, Directive, Inject, ViewContainerRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonAppService, UserService,CommissionService,SettingsService } from '../../../../services/index';
import { GlobalVariable } from '../../../../services/static-variable';

@Component({
    providers: [
        CommonAppService,
        UserService,
        CommissionService,
        SettingsService
    ],
    styleUrls: ['./checks-received-view.component.css'],
    templateUrl: './checks-received-view.component.html'
})

export class ChecksReceivedViewComponent implements OnInit, AfterViewInit {
    public currentUser: any;
    public checkList = [];
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
    public statusList = [];
    public suppliersList = [];
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
        public _commissionService : CommissionService,
        public _settingService : SettingsService
    ) {
        this._commonAppService.getCurrentUserSession( (user) => {
            this.currentUser = user;
            if (this._commonAppService.isUndefined(this.currentUser)) {
                window.location.href = '/login';
            }
        });

        var data = {
            settingObject: GlobalVariable.SETTING_KEYS.CHECK_STATUS
        }

        this._settingService.getSettingByKey(this.currentUser,data)
            .subscribe((res:any)=>{
                var arr = res.result.settings[0].settingValues;
                this.statusList = [];
                for(var i=0;i<arr.length ;i++)
                {
                    this.statusList.push(arr[i]);
                }
                
            });
    }

    public ngOnInit() {

        this.getSupplierList();
        this.refreshCheckList();
        
    }

    public getSupplierList() {
        let THIS = this;
        THIS._commissionService.getAllSuppliers(THIS.currentUser, {})
            .subscribe((data: any) => {
                if (data.status == '1') {
                        
                        THIS.suppliersList = THIS.getSupplierListOptions(data.result.suppliers);
                                           
                } else {
                    THIS.suppliersList = [];
                }
                // THIS.getClientList();
            },
                (error: any) => {
                    console.log(' Error while getAllSuppliers :  ' + JSON.stringify(error));
                });

    }

    public getSupplierListOptions(suppliers) {
        var supplierList = [];
        for (var i = 0; i < suppliers.length; i++) {
            supplierList.push({
                name: suppliers[i].name,
                _id: suppliers[i]._id,
            });

        }
        
        return supplierList;
    }

    public getSenderName(senderId)
    {
        for(var i = 0;i<this.suppliersList.length;i++)
        {
            if(this.suppliersList[i]._id === senderId)
            {
                return this.suppliersList[i].name;
            }
        }
    } 

    public ngAfterViewInit() {
        this._commonAppService.spinner.show();
        setTimeout(() => {
            this._commonAppService.spinner.hide();
        }, 1000);
    }

    public currentPageCountEvent($event){
        this.currentPageCount = $event;
        this.getCheckList(this.currentPageCount, this.limit);
    }

    public limitChangeEvent($event){
        this.limit = $event;
        this.getCheckList(0, this.limit);
    }


    public getCheckList(pageCount, limit) {

        this.currentPageCount = pageCount;


        let data = { 'pageCount': this.currentPageCount, 'limit': limit };
        data['search'] = this.searchObject;

        if(this.searchObject['sender'])
        {
            data['search']['ids'] = [];
            var regex = new RegExp("\\b" + this.searchObject['sender'].toLowerCase(), "i");
            for(var i=0;i<this.suppliersList.length;i++)
            {
                var name = this.suppliersList[i].name;
                if(regex.test(name))
                {
                    data['search']['ids'].push(this.suppliersList[i]._id);
                }
            }

        }
        

        if (this.currentSearchKey != '' && this.currentSearchValue != '') {
            data['searchBy'] = this.currentSearchKey;
            data['searchValue'] = this.currentSearchValue;
        }


        if(this.searchObject['status'] || this.searchObject['checkNumber'] || this.searchObject['sender']  )
        {
            this._commissionService.getAllChecks(this.currentUser, data)
            .subscribe((data: any) => {
                
                if (data.status == '1') {
                    
                    this.checkList = data.result.checks;
                    this.totalRecords = data.result.totalRecords;
                    let _pList = this._commonAppService.getPagerList(this.totalRecords, this.limit, this.currentPageCount);
                    this.pgList = (_pList) ? _pList : [];
                    
                
                } else {
                    this.checkList = [];
                    this.totalRecords = 0;
                    this.pagerList = [];
                    this.pgList['pages'] = [];
                }

                //this._commonAppService.spinner.hide();

            },
            (error: any) => {
                console.log(' Error while getAllChecks :  ' + JSON.stringify(error));
                //this._commonAppService.spinner.hide();
            });

        }
        else
        {
            this._commonAppService.spinner.show();
            setTimeout(()=>{
                this._commissionService.getAllChecks(this.currentUser, data)
                .subscribe((data: any) => {
                    
                    if (data.status == '1') {
                        
                        this.checkList = data.result.checks;
                        this.totalRecords = data.result.totalRecords;
                        let _pList = this._commonAppService.getPagerList(this.totalRecords, this.limit, this.currentPageCount);
                        this.pgList = (_pList) ? _pList : [];
                        
                    
                    } else {
                        this.checkList = [];
                        this.totalRecords = 0;
                        this.pagerList = [];
                        this.pgList['pages'] = [];
                    }

                    this._commonAppService.spinner.hide();

                    /*setTimeout (() => {
                    }, 1000);*/
                },
                (error: any) => {
                    console.log(' Error while getAllChecks :  ' + JSON.stringify(error));
                    this._commonAppService.spinner.hide();
                });

            },700);
            
        }

    }

    public onSearchChange(searchKey, searchValue) {
        this.checkIsSearching();
        this.currentSearchKey = searchKey;
        this.currentSearchValue = searchValue;
        this.getCheckList(0, this.limit);
    }

    public checkIsSearching() {
        this.isSearching = false;
        for (var i in this.searchObject) {
            if (this.searchObject[i] != '') {
                this.isSearching = true;
            }
        }
    }

    public getDatevalue(date){
        var c = new Date(date);
        
        var tmp =  c.getMonth() + 1;
        var month = "" + tmp;

        var day = ""+ c.getDate();
        var year = ""+ c.getFullYear();
        
        if(month.length == 1) month = "0"+ month;
        if(day.length == 1) day = "0"+ day;
        return month + "/" + day +"/" + year;
    }

    public refreshCheckList() {

        this.currentSearchKey = '';
        this.currentSearchValue = '';
        this.searchObject = {};
        this.checkList = [];
        this.pageCount = 0;
        this.limit = 10;
        this.totalRecords = 0;
        //this.currentPageCount = 0;
        
        this.pagerList = [];
        this.pgList['pages'] = [];
        this.getCheckList(this.currentPageCount, this.limit);
    }

    public setPageLimit(option) {
        this.limit = parseInt(option);
        this.getCheckList(0, this.limit);
    }

}
