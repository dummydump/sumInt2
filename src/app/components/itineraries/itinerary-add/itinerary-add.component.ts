/**
 * Itinerary Add Page Component.
 */
import { Component, ViewChild, NgModule, OnInit, Output, AfterViewInit, EventEmitter, OnDestroy, ElementRef, NgZone, Renderer, Directive, Inject, ViewContainerRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonAppService, UserService } from '../../../services/index';
import { GlobalVariable } from '../../../services/static-variable';

@Component({
    providers: [
        CommonAppService,
        UserService
    ],
    styleUrls: ['./itinerary-add.component.css'],
    templateUrl: './itinerary-add.component.html'
})

export class ItineraryAddComponent implements OnInit, AfterViewInit {
    public currentUser: any;

    constructor(
        public _route: ActivatedRoute,
        public _router: Router,
        public _commonAppService: CommonAppService,
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
