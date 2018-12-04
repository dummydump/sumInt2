/**
 * Navbar Page Component.
 */

import { Component, OnInit, ViewChild, Input, Output, EventEmitter, Inject, Renderer, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ROUTES } from './navbar-routes.config';
import { MenuType } from './navbar.metadata';
import { User } from '../../components/models/user';
import { CommonAppService } from '../../services/index';

@Component({
  moduleId: "navbarModule",
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [
    CommonAppService
  ]
})

export class NavbarComponent implements OnInit {
  public menuItems: any[];
  public userMenus: any[];
  public brandMenu: any;
  public userMenuTitle: string = "Hi, ";
  public isCollapsed = true;
  public isLoginByRentalLink: boolean = true;
  public isOpenLoginModal: boolean = false;

  constructor(
    public _route: ActivatedRoute,
    public _router: Router,
    public _commonAppService: CommonAppService) {
    this.isOpenLoginModal = _route.snapshot.params['login'];
  }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem.menuType === MenuType.UNAUTH);
    this.userMenus = ROUTES.filter(menuItem => menuItem.menuType === MenuType.AUTH);
    this.brandMenu = ROUTES.filter(menuItem => menuItem.menuType === MenuType.BRAND)[0];

  }
}
