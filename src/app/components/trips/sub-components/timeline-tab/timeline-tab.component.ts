/**
 * Timeline Tab Page Component.
 */
// tslint:disable-next-line:max-line-length
import { Component, ViewChild, NgModule, OnInit, Output, AfterViewInit, EventEmitter, OnDestroy, ElementRef, NgZone, Renderer, Directive, Inject, ViewContainerRef } from '@angular/core';
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
    selector: 'timeline-tab',
    styleUrls: ['./timeline-tab.component.css'],
    templateUrl: './timeline-tab.component.html'
})

export class TimelineTabComponent implements OnInit, AfterViewInit {
    public currentUser: any;

    constructor(
        public _route: ActivatedRoute,
        public _router: Router,
        public _commonAppService: CommonAppService,
        public _tripService: TripService,
        public _userService: UserService,
        public _viewContainerRef: ViewContainerRef
    ) {
        let THIS = this;
    }

    public ngOnInit() {
    }

    public ngAfterViewInit() {
    }
}
