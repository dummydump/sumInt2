/**
 * Sidebar Page Component.
 */

import { Component, OnInit, ViewChild, Input, Output, EventEmitter, Inject, Renderer, ElementRef, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { User } from '../../components/models/user';
import { CommonAppService, UserService } from '../../services/index';

@Component({
    moduleId: 'sidebarModule',
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css'],
    providers: [
        CommonAppService,
        UserService
    ]
})

export class SidebarComponent implements OnInit, AfterViewInit {
    public currentUser: any;
    public activePage = 'home';
    public clientId = '';
    constructor(
        public _route: ActivatedRoute,
        public _router: Router,
        public _commonAppService: CommonAppService,
        public _userService: UserService
    ) {

        this.clientId = '';
        this._commonAppService.getCurrentUserSession( (user)   => {
            this.currentUser = user;
        });
    }

    public ngOnInit() {

    }

    public ngAfterViewInit() {
    }

    public goToPage(page: any) {
        this.activePage = page;
        this._router.navigate([page, this.clientId]);
    }

}
