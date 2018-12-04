import { Component, OnInit, ViewChild, Input, Output, EventEmitter, Inject, Renderer, ElementRef, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CommonAppService, UserService } from './services/index';
import { AuthService } from 'angular4-social-login';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
        CommonAppService,
        UserService,
        AuthService
    ]
})

export class AppComponent {
  title = 'app';
  public currentUser: any;
  
  constructor(
    public _route: ActivatedRoute,
    public _router: Router,
    public _commonAppService: CommonAppService,
    private _socialAuthService: AuthService,
    public _userService: UserService
  ) {
    let THIS = this;
    let url = THIS._router.url;
    THIS._commonAppService.getCurrentUserSession((user) => {
          THIS.currentUser = user;
          if (THIS._commonAppService.isUndefined(THIS.currentUser)) {
              // window.location.href = '/login';
          }
      });
  }

  public logout() {
    let THIS = this;
    THIS._socialAuthService.signOut();
    setTimeout(function() {
      THIS._commonAppService.removeCurrentUserSession((err, res) => {
        THIS._socialAuthService.authState.subscribe((user) => {
          window.location.href = '/login';
        });
      });
    }, 1000);
  }
}
