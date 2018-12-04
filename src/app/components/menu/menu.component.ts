/**
 * Menu Page Component.
 */

import { Component, OnInit, ViewChild, Input, Output, EventEmitter, Inject, Renderer, ElementRef, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { User } from '../../components/models/user';
import { CommonAppService, UserService } from '../../services/index';
import { AuthService } from "angular4-social-login";

@Component({
    moduleId: "menuModule",
    selector: 'menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css'],
    providers: [
        CommonAppService,
        UserService,
        AuthService
    ]
})

export class MenuComponent implements OnInit, AfterViewInit {
    public currentUser: any;
    public activePage = 'home';
    constructor(
        public _route: ActivatedRoute,
        public _router: Router,
        public _commonAppService: CommonAppService,
        private _socialAuthService: AuthService,
        public _userService: UserService
    ) {

        
    }

    public ngOnInit() {

    }

    public ngAfterViewInit() {
    }

    public goToPage(page: any) {
        this.activePage = page;
        this._router.navigate([page]);
    }
}
