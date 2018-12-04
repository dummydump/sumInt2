/**
 * User Add Page Component.
 */
// tslint:disable-next-line:max-line-length
import { Component, ViewChild, NgModule, OnInit, Output, AfterViewInit, EventEmitter, OnDestroy, ElementRef, NgZone, Renderer, Directive, Inject, ViewContainerRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonAppService, UserService, RoleService } from '../../../services/index';
import { GlobalVariable } from '../../../services/static-variable';
import { MaskService } from 'ngx-mask';
import { CountryService } from '../../../services/country.service';
import {StateService} from '../../../services/state.service';
import {CityService} from '../../../services/city.service';

@Component({
    providers: [
        CommonAppService,
        UserService,
        RoleService,
        MaskService,
        CountryService,
        StateService,
        CityService
    ],
    styleUrls: ['./user-add.component.css'],
    templateUrl: './user-add.component.html'
})

export class UserAddComponent implements OnInit, AfterViewInit {
    public currentUser: any;
    public userObject = {
        '_id': '',
        'email': '',
        'roleName': '',
        'gender': 'male',
        'firstName': '',
        'lastName': '',
        'phone1': '',
        'phone2': '',
        'address1': '',
        'address2': '',
        'city': '',
        'state':'',
        'zipCode':'',
        'country': '',
        'assistantOf': ''
    };
    public rolesList = ['Manager', 'Admin', 'Agent', 'Assistant'];
    // public rolesList = [];
    public countries = [];
    public cities = [];
    public agentsList = [];
    public stateList = [];

    constructor(
        public _route: ActivatedRoute,
        public _router: Router,
        public _commonAppService: CommonAppService,
        public _userService: UserService,
        public _roleService: RoleService,
        public userObjectwContainerRef: ViewContainerRef,
        public _MaskService: MaskService,
        public _countryService: CountryService,
        public _stateService:StateService,
        public _cityService:CityService
    ) {


        _commonAppService.getCurrentUserSession( (user) => {
            this.currentUser = user;
            if (_commonAppService.isUndefined(this.currentUser) ) {
                window.location.href = '/login';
            } else if (!_commonAppService.isManagerOrAdmin(this.currentUser.user.roleName)) {
                window.location.href = '/dashboard';
            } else {
                this.rolesList = _commonAppService.getRoleListByUserRole(this.currentUser.user.roleName);
            }
        });



        this.userObject = {
            '_id': '',
            'email': '',
            'roleName': '',
            'gender': 'male',
            'firstName': '',
            'lastName': '',
            'phone1': '',
            'phone2': '',
            'address1': '',
            'address2': '',
            'city': '',
            'state':'',
            'zipCode':'',
            'country': '',
            'assistantOf': ''
        };
        // Suggestion:userId not reassigned,better to make constant
        let userId = _route.snapshot.params['userId'];
        if (!_commonAppService.isUndefined(userId)) {
            _userService.getUserById(this.currentUser, userId)
            .subscribe((data: any) => {
                setTimeout(() => {
                    this.userObject = data.result.user;
                }, 0);
            },
            (error: any) => {
                console.log(' Error while getUserById :  ' + JSON.stringify(error));
            });
        }

        this.getAgentList();

        // this.getRoleList();
    }

    public ngOnInit() {
        let data = {};
        this._countryService.getAllCountries(this.currentUser,data)
           .subscribe(data => {
               
                   console.log('country',data.result.countries);
                   for(let i =0 ;i<data.result.countries.length;i++){
                    this.countries.push(data.result.countries[i]);
                   }
                   
               
           });
           console.log('!!!',this.countries);
    }

    public countrySelected($event){
        this.userObject.state = '';
        this.userObject.city = '';
        this.stateList=[];
        this.cities=[];
        console.log('HEREEE');
        console.log('==>',$event.target.value);
        let data ={};
        this._stateService.getAllStatesByCountryId(this.currentUser,$event.target.value)
           .subscribe(data => {
               
                   console.log('STATES->',data.result.states);
                   for(let i=0;i<data.result.states.length;i++){
                       this.stateList.push(data.result.states[i]);
                   }
               
           });

    }
    public stateSelected($event){
        // this.userObject.state = '';
        this.userObject.city = '';
        this.cities = [];
        console.log('HEREEE');
        console.log('==>',$event.target.value);
        let data ={};
        this._cityService.getAllCitiesByStateId(this.currentUser,$event.target.value)
           .subscribe(data => {
               
                   console.log('CITIES->',data.result.cities);
                   for(let i=0;i<data.result.cities.length;i++){
                       this.cities.push(data.result.cities[i]);
                   }
               
           });

    }

    public ngAfterViewInit() {
    }

    public getAgentList() {

        this._userService.getAllAgents(this.currentUser, {})
            .subscribe((data: any) => {
                if (data.status == '1') {
                    this.agentsList = data.result.users;
                    console.log('data found');
                } else {
                    console.log('data not found');
                }
                console.log(' agentsList ' + JSON.stringify(this.agentsList));
            },
            (error: any) => {
                console.log(' Error while getAllAgents :  ' + JSON.stringify(error));
            });

    }

    public saveUser(flag) {

        console.log(' this.userObject ' + JSON.stringify(this.userObject));
        console.log('userObject email',this.userObject['email']);
        // tslint:disable-next-line:max-line-length
        if (this._commonAppService.isUndefined(this.userObject['email']) || this._commonAppService.isUndefined(this.userObject['firstName']) || this._commonAppService.isUndefined(this.userObject['lastName'])) {
            this._commonAppService.showErrorMessage('Alert', this._commonAppService.requiredFieldMessage, function (alertRes) {
            });
        } else if (this._commonAppService.validateEmail(this.userObject['email'])) {
            this._commonAppService.showErrorMessage('Alert', 'Invalid Email ID!', function (alertRes) {
            });
        } else {
            this._userService.addUpdateUser(this.currentUser, this.userObject, this.userObject['_id'])
            .subscribe((data: any) => {
                console.log(' Data ' + JSON.stringify(data));
                if (data.status == '1') {
                    this._commonAppService.showSuccessMessage('Alert', data.result.message, function(alertRes) {});
                }
                if (data.status == '1' && this.userObject['_id'] == '') {
                    this.userObject['_id'] = data.result._id;
                }
                if (data.status == '0') {
                    this._commonAppService.showErrorMessage('Alert', data.result.error, function(alertRes) {});
                }
                if (flag == true) {
                    this.closePage();
                }
            },
            (error: any) => {
                this._commonAppService.showErrorMessage('Alert', error, function(alertRes) {});
                if (flag == true) {
                    this.closePage();
                }
            });
        }
    }

    public getRoleList() {

        this._roleService.getRoles(this.currentUser, {})
            .subscribe((data: any) => {
                console.log(' data', data);
                if (data.status == '1') {
                    this.rolesList = data.result.roles;
                } else {
                    this.rolesList = [];
                }
            },
            (error: any) => {
                console.log(' Error while getRoles :  ' + JSON.stringify(error));
            });
    }

    public closePage() {

        this._router.navigate(['users']);
    }

    public roleSelectChanged() {
        console.log('userObject.roleName' + this.userObject.roleName);
    }
}
