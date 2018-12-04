/**
 * Dashboard Page Component.
 */
import { Component, ViewChild, NgModule, OnInit, Output, Input, AfterViewInit, EventEmitter, OnDestroy, ElementRef, NgZone, Renderer, Directive, Inject, ViewContainerRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonAppService, UserService } from '../../services/index';
import { GlobalVariable } from '../../services/static-variable';

@Component({
    providers: [
        CommonAppService,
        UserService
    ],
    styleUrls: ['./dashboard.component.css'],
    templateUrl: './dashboard.component.html'
})

export class DashboardComponent implements OnInit, AfterViewInit {
    public currentUser: any;

    constructor(
        public _route: ActivatedRoute,
        public _router: Router,
        public _commonAppService: CommonAppService,
        public _userService: UserService,
        public _viewContainerRef: ViewContainerRef
    ) {

        this._commonAppService.getCurrentUserSession( (user) => {
            this.currentUser = user;
            if (this._commonAppService.isUndefined(this.currentUser)) {
                window.location.href = '/login';
            }
        });
    }

    public ngOnInit() {
    }

    ngAfterViewInit() {
    }

    keyupHandler($event){
    }
}
