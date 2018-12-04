/**
 * Cruise Lines Page Add Component.
 */
// tslint:disable-next-line:max-line-length
import { Component, ViewChild, NgModule, OnInit, Output, AfterViewInit, EventEmitter, OnDestroy, ElementRef, NgZone, Renderer, Directive, Inject, ViewContainerRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonAppService, UserService,CruiseService } from '../../../../services/index';
import { GlobalVariable } from '../../../../services/static-variable';

@Component({
    providers: [
        CommonAppService,
        UserService,
        CruiseService
    ],
    styleUrls: ['./cruiselines-add.component.css'],
    templateUrl: './cruiselines-add.component.html'
})

export class ManageCruiseLinesComponent implements OnInit, AfterViewInit {
    public currentUser: any;
    public cruiselineName : string;
    public ships : Number;
    public cruiselineId:string ;
    public isEditMode = false;

    constructor(
        public _route: ActivatedRoute,
        public _router: Router,
        public _commonAppService: CommonAppService,
        public _userService: UserService,
        public _cruiseService : CruiseService,
        public _viewContainerRef: ViewContainerRef 
    ) {

        this._commonAppService.getCurrentUserSession( (user) => {
            this.currentUser = user;
            if (this._commonAppService.isUndefined(this.currentUser)) {
                window.location.href = '/login';
            }
        });
        this.cruiselineId =  _route.snapshot.params['id'];

    }

    public ngOnInit() {

        if(!this._commonAppService.isUndefined(this.cruiselineId))
        {
            this._cruiseService.getCruiseLinesById(this.currentUser,this.cruiselineId)
            .subscribe((data:any) => {
                if(data.status == "1")
                {
                    this.isEditMode = true;
                    this.cruiselineName = data.result.cruiseline.name;
                    this.ships = data.result.cruiseline.ships;
                }
                console.log(data);
            })
        }
        else
        {
            this.cruiselineName = "";
            this.ships = 0;
        }
    
    }

    public ngAfterViewInit() {
    }

    public saveCruiseline(close =0)
    {
        if(!this.isValidatedData())
        {
            //console.log('incomplete name');
            return;
        }

        if(this.isEditMode)
        {
            var data = {
                name : this.cruiselineName,
                ships: this.ships
            }
            this._cruiseService.updateCruiseLinesById(this.currentUser,this.cruiselineId,data)
            .subscribe((res:any) => {
                if(res.status == '1')
                {
                    this._commonAppService.showSuccessMessage('Alert', res.result.message, (alertRes) => {});
                    if(close == 1)
                    {
                        setTimeout (() => {
                            this._router.navigate(['/cruiselines']);    
                         }, 2000);
                    }
                }
                else
                {
                    this._commonAppService.showErrorMessage('Alert',res.result.message, (alertRes)=>{} );
                }
                
            },
            (error: any) => {
                this._commonAppService.showErrorMessage('Alert', error, function (alertRes) { });
            });
        }
        else
        {
            var data = {
                name : this.cruiselineName,
                ships: this.ships
            }
            this._cruiseService.addCruiseLine(this.currentUser,data)
            .subscribe((res:any) => {
                if(res.status == '1')
                {
                    this._commonAppService.showSuccessMessage('Alert', res.result.message, (alertRes) => {});
                    setTimeout (() => {
                        if(close == 0)
                        this._router.navigate(['/manageCruiselines/'+res.result._id]);    
                        else
                        this._router.navigate(['/cruiselines']);
                        
                    }, 2000);
                }
                else
                {
                    this._commonAppService.showErrorMessage('Alert',res.result.message, (alertRes)=>{} );
                }
                
            },
            (error: any) => {
                this._commonAppService.showErrorMessage('Alert', error, function (alertRes) { });
            });
            
        }
    }

    public showValidationMessage(message) {
        this._commonAppService.showErrorMessage('Alert', message, function (alertRes) {
        });
    }
    
    public isValidatedData()
    {
        if (this.cruiselineName.trim() === '') {
            this.showValidationMessage('Cruise Line Name is required');
            return false;
        }
        if (!this.ships) {
            this.showValidationMessage('Number of ships is required');
            return false;
        }
        if(this.ships <1){
            this.showValidationMessage('ships cannot be negative');
            return false;
        }
        return true;
    }

    public gotolist()
    {
        this._router.navigate(['/cruiselines']);    
    }

}
