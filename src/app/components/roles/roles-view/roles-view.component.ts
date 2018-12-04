/**
 * Roles View Page Component.
 */
// tslint:disable-next-line:max-line-length
import { Component, ViewChild, NgModule, OnInit, Output, AfterViewInit, EventEmitter, OnDestroy, ElementRef, NgZone, Renderer, Directive, Inject, ViewContainerRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonAppService, UserService, RoleService } from '../../../services/index';
import { GlobalVariable } from '../../../services/static-variable';

@Component({
    providers: [
        CommonAppService,
        UserService,
        RoleService
    ],
    styleUrls: ['./roles-view.component.css'],
    templateUrl: './roles-view.component.html'
})

export class RolesViewComponent implements OnInit, AfterViewInit {
    public currentUser: any;
    public rolesList = [];
    public pageCount = 0;
    public limit = 10;
    public totalRecords = 0;
    public currentPageCount = 0;
    public pagerList = [];
    public currentSearchKey = '';
    public currentSearchValue = '';
    public searchObject = {};
    public pgList = {};

    public accessModuleList = [];

    constructor(
        public _route: ActivatedRoute,
        public _router: Router,
        public _commonAppService: CommonAppService,
        public _userService: UserService,
        public _roleService: RoleService,
        public _viewContainerRef: ViewContainerRef
    ) {
// THIS is made constant
        const THIS = this;
//  Redirecting Directly to the dashboard.Change this,if this component is needed
        THIS._commonAppService.getCurrentUserSession((user) => {window.location.href = '/dashboard'; } );

        THIS.getRoleList(0, 10);
        THIS.searchObject = {'name': ''};

        THIS.accessModuleList = [
            {'moduleName': 'Dashboard', 'permission': 'r'},

            {'moduleName': 'Users', 'permission': 'r'},
            {'moduleName': 'Roles', 'permission': 'r'},
            {'moduleName': 'Clients', 'permission': 'r'},
            {'moduleName': 'Trips', 'permission': 'r'}
        ];

    }

    public ngOnInit() {
    }

    public ngAfterViewInit() {
    }

    public getRoleList(pageCount, limit) {
        let THIS = this;
        THIS.currentPageCount = pageCount;




        let data = { 'pageCount': pageCount, 'limit': limit};

        if (THIS.currentSearchKey != '' && THIS.currentSearchValue != '') {
            data['searchBy'] = THIS.currentSearchKey;
            data['searchValue'] = THIS.currentSearchValue;
        }

        THIS._roleService.getRoles(THIS.currentUser, data)
            .subscribe((data: any) => {
                if (data.status == '1') {
                    setTimeout(() => {
                        THIS.rolesList = data.result.roles;
                        THIS.totalRecords = data.result.totalRecords;
                        let _pList = THIS._commonAppService.getPagerList(THIS.totalRecords, THIS.limit, pageCount);
                        THIS.pgList = (_pList) ? _pList : [];
                    }, 0);
                } else {
                    THIS.rolesList = [];
                    THIS.totalRecords = 0;
                    THIS.pagerList = [];
                    THIS.pgList['pages'] = [];
                }
            },
            (error: any) => {
                console.log(' Error while getRoles :  ' + JSON.stringify(error));
            });
    }

    public removeRoleById(roleId) {
        let THIS = this;
        THIS._commonAppService.openConfirmDialog('Confirm', THIS._commonAppService.removeConfirmMessage, function(confirmRes) {
            if (confirmRes == true) {
                THIS._roleService.removeRoleById(THIS.currentUser, roleId)
                    .subscribe((data: any) => {
                        THIS._commonAppService.showSuccessMessage('Alert', data.result.message, function(alertRes) {});
                        THIS.getRoleList(0, 10);
                    },
                    (error: any) => {
                        THIS._commonAppService.showErrorMessage('Alert', error, function(alertRes) {});
                    });
            }
        });
    }

    public onSearchChange(searchKey, searchValue) {
        let THIS = this;
        THIS.currentSearchKey = searchKey;
        THIS.currentSearchValue = searchValue;
        THIS.getRoleList(THIS.currentPageCount, THIS.limit);
    }

    public refreshRoleList() {
        let THIS = this;
        THIS.currentSearchKey = '';
        THIS.currentSearchValue = '';
        THIS.searchObject = {'name': ''};
        THIS.rolesList = [];
        THIS.pageCount = 0;
        THIS.limit = 10;
        THIS.totalRecords = 0;
        THIS.currentPageCount = 0;
        THIS.pagerList = [];
        THIS.pgList['pages'] = [];
        THIS.getRoleList(0, THIS.limit);
    }

}
