/**
 * Users View Page Component.
 */
// tslint:disable-next-line:max-line-length
import { Component, ViewChild, NgModule, OnInit, Output, AfterViewInit, EventEmitter, OnDestroy, ElementRef, NgZone, Renderer, Directive, Inject, ViewContainerRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonAppService, UserService, RoleService } from '../../../services/index';
import { GlobalVariable } from '../../../services/static-variable';
import {MaskService} from 'ngx-mask';
@Component({
    providers: [
        CommonAppService,
        UserService,
        RoleService,
        MaskService
    ],
    styleUrls: ['./users-view.component.css'],
    templateUrl: './users-view.component.html'
})

export class UsersViewComponent implements OnInit, AfterViewInit {
    public currentUser: any;
    public usersList = [];
    public rolesList = [];
    public pageCount = 0;
    public limit = 10;
    public totalRecords = 0;
    public currentPageCount = 0;
    public pagerList = [];
    public currentSearchKey = '';
    public currentSearchValue = '';
    public searchObject = {};
    public isSearching = true;
    public pgList = {};
    public isSpinner = true;

    constructor(
        public _route: ActivatedRoute,
        public _router: Router,
        public _commonAppService: CommonAppService,
        public _userService: UserService,
        public _roleService: RoleService,
        public _viewContainerRef: ViewContainerRef,
        public _MaskService: MaskService
    ) {
        _commonAppService.getCurrentUserSession( (user) => {
            this.currentUser = user;
            if (_commonAppService.isUndefined(this.currentUser)) {
                window.location.href = '/login';
            } else if (!_commonAppService.isManagerOrAdmin(this.currentUser.user.roleName)) {
                window.location.href = '/dashboard';
            }
        });
        this.searchObject = {'firstName': '', 'lastName': '', 'address': '', 'telephone': '', 'email': '', 'role': ''};
    }

    spinnerConfig = {
        bdColor: '#333',
        size: 'large',
        color: '#fff'
      };

    public ngOnInit() {
        this.getRoleList();
    }

    public ngAfterViewInit() {  }


    public currentPageCountEvent($event){
        this.currentPageCount = $event;
        this.getUserList(this.currentPageCount, this.limit);
    }

    public limitChangeEvent($event){
        this.limit = $event;
        this.getUserList(0, this.limit);
    }

    public getUserList(pageCount, limit) {

        this.currentPageCount = (this.isSearching && this.pgList['pages'] && this.pgList['pages'].length < 2)? 0 : pageCount;

        // Suggetsion : data is never reassigned,So better to make it constatnt
        let data = { 'pageCount': this.currentPageCount, 'limit': limit };
        data['search'] = this.searchObject;

        if (this.isSpinner && !this.isSearching) {
            this._commonAppService.spinner.show();
        }

        this._userService.getAllUsers(this.currentUser, data)
            // tslint:disable-next-line:no-shadowed-variable
            .subscribe(( data: any) => {
                if (data.status == '1') {
                    setTimeout(() => {
                        this.usersList = data.result.users;
                        this.totalRecords = data.result.totalRecords;
                        // Suggetsion : _pList is never reassigned,So better to make it constatnt
                        let _pList = this._commonAppService.getPagerList(this.totalRecords, this.limit, this.currentPageCount);
                        this.pgList = (_pList) ? _pList : [];
                    }, 0);
                } else {
                    this.usersList = [];
                    this.totalRecords = 0;
                    this.pagerList = [];
                    this.pgList['pages'] = [];
                }
                setTimeout(() => {
                    this._commonAppService.spinner.hide();
                }, 1000);
                this.isSpinner = true;
            },
            (error: any) => {
                console.log(' Error while getAllUsers :  ' + JSON.stringify(error));
            });
    }

    public removeUserById(userId, pos: number) {

        this._commonAppService.showConfirmDialog(this._commonAppService.removeConfirmMessage,  (confirmRes) => {
            if (confirmRes == true) {
                this._userService.removeUserById(this.currentUser, userId)
                    .subscribe((data: any) => {
                        this._commonAppService.showSuccessMessage('Alert', data.result.message, function(alertRes) {
                        });
                        this.totalRecords = this.totalRecords - 1;
                        this.usersList.splice(pos, 1);
                    },
                    (error: any) => {
                        this._commonAppService.showErrorMessage('Alert', error, function(alertRes) {});
                    });
            }
        });
    }

    public onSearchChange(searchKey, searchValue) {
        this.checkIsSearching();
        this.getUserList(this.currentPageCount, this.limit);
    }

    public refreshUserList() {
        this.currentSearchKey = '';
        this.currentSearchValue = '';
        this.searchObject = {'firstName': '', 'lastName': '', 'address': '', 'telephone': '', 'email': '', 'role': ''};
        this.usersList = [];
        this.pageCount = 0;
        this.limit = 10;
        this.totalRecords = 0;
        this.currentPageCount = 0;
        this.pagerList = [];
        this.pgList['pages'] = [];
        this.getUserList(0, this.limit);
    }

    public checkIsSearching() {
        this.isSearching = false;
        for ( var i in this.searchObject) {
             if (this.searchObject[i] != '') {
                this.isSearching = true;
             }
        }
    }

    public getRoleList() {
        this._commonAppService.spinner.show();
        this._roleService.getRoles(this.currentUser, {})
            .subscribe((data: any) => {
                this.getUserList(0, 10);
                if (data.status == '1') {
                    this.rolesList = data.result.roles;
                } else {
                    this.rolesList = [];
                }
                setTimeout( () => {
                    this._commonAppService.spinner.hide();
                }, 1000);
            },
            (error: any) => {
                console.log(' Error while getRoles :  ' + JSON.stringify(error));
            });
    }

    public setPageLimit(option) {
        this.limit = parseInt(option);
        this.getUserList(0, this.limit);
    }

    public getFormattedValue (phoneno) {
        return this._MaskService.applyMask(phoneno, '000-000-0000');
    }

}
