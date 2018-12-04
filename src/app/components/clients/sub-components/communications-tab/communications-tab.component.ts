/**
 * Communications Tab Page Component.
 */
import { Component, ViewChild, NgModule, OnInit, Output, AfterViewInit, EventEmitter, OnDestroy, ElementRef, NgZone, Renderer, Directive, Inject, ViewContainerRef, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonAppService, TripService, UserService } from '../../../../services/index';
import { GlobalVariable } from '../../../../services/static-variable';

@Component({
    providers: [
        CommonAppService,
        TripService,
        UserService
    ],
    selector: 'communications-tab',
    styleUrls: ['./communications-tab.component.css'],
    templateUrl: './communications-tab.component.html'
})

export class CommunicationsTabComponent implements OnInit, AfterViewInit {
    public currentUser: any;
    @Input('clientObject') clientObject = {};

    constructor(
        public _route: ActivatedRoute,
        public _router: Router,
        public _commonAppService: CommonAppService,
        public _tripService: TripService,
        public _userService: UserService,
        public _viewContainerRef: ViewContainerRef
    ) {
        
    }

    public ngOnInit() {
    }

    public ngAfterViewInit() {
    }
}
