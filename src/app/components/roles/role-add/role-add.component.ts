/**
 * Role Add Page Component.
 */
// tslint:disable-next-line:max-line-length
import { Component, ViewChild, NgModule, OnInit, Output, AfterViewInit, EventEmitter, OnDestroy, ElementRef, NgZone, Renderer, Directive, Inject, ViewContainerRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonAppService, RoleService } from '../../../services/index';
import { GlobalVariable } from '../../../services/static-variable';

@Component({
    providers: [
        CommonAppService,
        RoleService
    ],
    styleUrls: ['./role-add.component.css'],
    templateUrl: './role-add.component.html'
})


export class RoleAddComponent implements OnInit, AfterViewInit {
    public currentUser: any;
    public roleObject = {
        '_id': '',
        'name': '',
        'access': []
    };
    public accessModuleList = [];

    constructor(
        public _route: ActivatedRoute,
        public _router: Router,
        public _commonAppService: CommonAppService,
        public _roleService: RoleService,
        public _viewContainerRef: ViewContainerRef
    ) {
// THIS is made constant
        const THIS = this;
//  Redirecting Directly to the dashboard.Change this,if this component is needed
        THIS._commonAppService.getCurrentUserSession((user) => {window.location.href = '/dashboard'; } );

        THIS.roleObject = {
            '_id': '',
            'name': '',
            'access': []
        };

        THIS.accessModuleList = [
            {'moduleName': 'Dashboard', 'permission': 'r'},
            {'moduleName': 'Users', 'permission': 'r'},
            {'moduleName': 'Roles', 'permission': 'r'},
            {'moduleName': 'Clients', 'permission': 'r'},
            {'moduleName': 'Trips', 'permission': 'r'}
        ];

        let roleId = _route.snapshot.params['roleId'];
        if (!THIS._commonAppService.isUndefined(roleId)) {
            THIS._roleService.getRoleById(THIS.currentUser, roleId)
            .subscribe((data: any) => {
                setTimeout(() => {
                    THIS.roleObject = data.result.role;
                    THIS.accessModuleList = THIS.roleObject['access'];
                }, 0);
            },
            (error: any) => {
                console.log(' Error while getRoleById :  ' + JSON.stringify(error));
            });

        }
    }

    public ngOnInit() {
    }

    public ngAfterViewInit() {
    }

    public saveRole(flag) {
        let THIS = this;
        if (THIS._commonAppService.isUndefined(THIS.roleObject['name'])) {
            THIS._commonAppService.showErrorMessage('Alert', THIS._commonAppService.requiredFieldMessage, function (alertRes) {
            });
        } else {
            THIS.roleObject['access'] = THIS.accessModuleList;
            THIS._roleService.addUpdateRole(THIS.currentUser, THIS.roleObject, THIS.roleObject['_id'])
            .subscribe((data: any) => {
                THIS._commonAppService.showSuccessMessage('Alert', data.result.message, function(alertRes) {
                });
                if (data.status == '1' && THIS.roleObject['_id'] == '') {
                    THIS.roleObject['_id'] = data.result._id;
                }
                if (flag == true) {
                    THIS.closePage();
                }
            },
            (error: any) => {
                THIS._commonAppService.showErrorMessage('Alert', error, function(alertRes) {});
                if (flag == true) {
                    THIS.closePage();
                }
            });
        }
    }

    public changeAccess(access, $event, index) {
        let THIS = this;
        THIS.accessModuleList[index]['permission'] = ($event.currentTarget.checked == true) ? 'rw' : 'r';
    }

    public closePage() {
        let THIS = this;
        THIS._router.navigate(['roles']);
    }

}
