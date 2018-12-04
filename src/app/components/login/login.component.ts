/**
 * Login Page Component.
 */
import { Component, ViewChild, NgModule, OnInit, Output, AfterViewInit, EventEmitter, OnDestroy, ElementRef, NgZone, Renderer, Directive, Inject, ViewContainerRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonAppService, UserService } from '../../services/index';
import { GlobalVariable } from '../../services/static-variable';
import { AuthService } from "angular4-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angular4-social-login";
 
@Component({
    providers: [
        CommonAppService,
        UserService,
        AuthService
    ],
    styleUrls: ['./login.component.css'],
    templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit, AfterViewInit {
    public currentUser: any;

    constructor(
        public _route: ActivatedRoute,
        public _router: Router,
        public _commonAppService: CommonAppService,
        public _userService: UserService,
        private _socialAuthService: AuthService,
        public _viewContainerRef: ViewContainerRef
    ) {
        
    }

    public ngOnInit() {
        
        this._commonAppService.getCurrentUserSession( (user) => {
            this.currentUser = user;
            if (!this._commonAppService.isUndefined(this.currentUser)) {
                window.location.href = '/dashboard';
                return;
            }
        });

        this._socialAuthService.authState.subscribe((user) => {
            if(user){
                let userEmail = user['email'];

                this._userService.getUserToken(this.currentUser, userEmail)
                    .subscribe((userDetail: any) => {
                        if (this._commonAppService.isFail(userDetail)) {
                            this.authenticationFail(userDetail);
                        } else {
                            this._commonAppService.setCurrentUserSession(userDetail.result);
                            window.location.href = '/dashboard';
                        }
                    },
                    (error: any) => {
                        console.log(' Error while getUserToken : ' + JSON.stringify(error));
                    });
            }
        });
    }

    public ngAfterViewInit() {
    }

    public socialLogin(provider) {
        
        this._socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    }

    public authenticationFail(userDetail){
        
        this._commonAppService.showErrorMessage('Alert', 'Fail : ' + userDetail.result.Message, function (alertRes) {});
        this._socialAuthService.signOut();
    }
}
