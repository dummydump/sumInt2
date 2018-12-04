/**
 * Tracking Tab Page Component.
 */
import { Component, ViewChild, NgModule, OnInit, Output, AfterViewInit, EventEmitter, OnDestroy, ElementRef, NgZone, Renderer, Directive, Inject, ViewContainerRef, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonAppService, ClientService, UserService, WorkspaceExtensionsService, EmailAutomationService } from '../../../../services/index';
import { GlobalVariable } from '../../../../services/static-variable';

@Component({
    providers: [
        CommonAppService,
        ClientService,
        WorkspaceExtensionsService,
        EmailAutomationService
    ],
    selector: 'tracking-tab',
    styleUrls: ['./tracking-tab.component.css'],
    templateUrl: './tracking-tab.component.html'
})

export class TrackingTabComponent implements OnInit, AfterViewInit {
    public currentUser: any;
    @Input('clientObject') clientObject = {};
    @Input('allClients') allClients = [];
    @Input('allRelatives') allRelatives = [];
    public statesComplex = [];
    public newClientObject = {
        "_id": "",
        "firstName": "",
        "middleName": "",
        "lastName": "",
        "telephone": "",
        "birthDate": "",
        "agent": {
            "agentFirstName": "",
            "agentLastName": "",
            "agentId": ""
        }
    };
    public clientTags = [];
    public newClientName: string;
    public editContactIndex = 0;
    public Flage = true;
    public isAddRelatives: boolean;
    public isEditRelatives: boolean;
    public typeaheadNoResults: boolean;

    public spinnerConfig = {
        bdColor: '#333',
        size: 'large',
        color: '#fff'
    }

    public relationShipArray = ['Father', 'Mother', 'Partner(Male)', 'Partner(Female)', 'Wife', 'Husband', 'Girlfriend', 'Boyfriend', 'Daughter', 'Son', 'Sister', 'Brother', 'Grandmother', 'Grandfather', 'Granddaughter', 'Grandson', 'Aunt', 'Uncle', 'Niece'];

    public relationObject = { clientId: '', relativeClientId: '', relation: '' };

    constructor(
        public _route: ActivatedRoute,
        public _router: Router,
        public _commonAppService: CommonAppService,
        public _clientService: ClientService,
        public _workspaceExtensionsService: WorkspaceExtensionsService,
        public _emailAutomationService: EmailAutomationService,
        public _viewContainerRef: ViewContainerRef
    ) {
        this._commonAppService.getCurrentUserSession((user) => {
            this.currentUser = user;
            if (this._commonAppService.isUndefined(this.currentUser)) {
                window.location.href = '/login';
            } else {
                this.getRelations();
            }
        });
    }


    public ngOnInit() {
        this.newClientObject = {
            "_id": "",
            "firstName": "",
            "middleName": "",
            "lastName": "",
            "telephone": "",
            "birthDate": "",
            "agent": {
                "agentFirstName": "",
                "agentLastName": "",
                "agentId": ""
            }
        };
    }

    public ngAfterViewInit() { }


    public modelChanged(e) {
        if (e.length >= 2) {
            this.getAllClients({ "search": e });
            this.Flage = false;
        } else if (e.length < 2) {
            this.Flage = true;
            this.statesComplex = []
        }
    }


    public saveNewClient() {
        
        this.newClientObject.agent.agentFirstName = this.clientObject['agent'].agentFirstName;
        this.newClientObject.agent.agentLastName  = this.clientObject['agent'].agentLastName;
        this.newClientObject.agent.agentId        = this.clientObject['agent'].agentId;

        if (this._commonAppService.isUndefined(this.newClientObject['firstName']) || this._commonAppService.isUndefined(this.newClientObject['lastName']) || this._commonAppService.isUndefined(this.newClientObject['gender'])) {
            this._commonAppService.showErrorMessage('Alert', this._commonAppService.requiredFieldMessage, function (alertRes) {
            });
        } 
        else if( !this._commonAppService.isValidTelephone(this.newClientObject.telephone) && this.newClientObject.telephone){
            this._commonAppService.showErrorMessage('Alert', "Telephone number not valid format", function (alertRes) {
            });
        }else {
            this.newClientObject['clientTags'] = this.clientTags;
           // console.log(this.clientObject['agent']);
            //Adding agent to the newClient
            this.newClientObject.agent.agentFirstName = this.clientObject['agent'].agentFirstName;
            this.newClientObject.agent.agentLastName = this.clientObject['agent'].agentLastName;
            this.newClientObject.agent.agentId = this.clientObject['agent'].agentId;

            this._clientService.addUpdateClient(this.currentUser, this.newClientObject, '', this.editContactIndex)
                .subscribe((data: any) => {
                    this._commonAppService.showSuccessMessage('Alert', data.result.message, function (alertRes) {
                    });
                    if (data.status == '1' && this.newClientObject['_id'] == '') {
                        this.getAllClients({ "search": this.newClientObject['firstName'] });
                        this.typeaheadNoResults = false;
                        this.relationObject['relativeClientId'] = data.result._id;
                        this.newClientName = this.newClientObject['firstName'] + ' ' + this.newClientObject['lastName'];

                        if (this.newClientObject['birthDate']) {
                            this.addUpdateWorkspaceExtension(this.relationObject['relativeClientId'], this.newClientObject['birthDate']);
                        }
                        setTimeout(() => {
                            this.getRelations();
                        }, 5000);
                        console.log(this.newClientObject);
                        this.newClientObject = {
                            "_id": "",
                            "firstName": "",
                            "middleName": "",
                            "lastName": "",
                            "telephone": "",
                            "birthDate": "",
                            "agent": {
                                "agentFirstName": "",
                                "agentLastName": "",
                                "agentId": ""
                            }
                           
                        };
 //console.log(this.newClientObject.agent.agentFirstName);
 
                    }
                },

                (error: any) => {
                    this._commonAppService.showErrorMessage('Alert', error, function (alertRes) { });
                });
        }
    }

    public addUpdateWorkspaceExtension(clientId, birthDate) {
        let emailCounter = 1;

        let workspaceExtensionObj = {
            'clientId': clientId,
            'title': 'Birthday-Anniversary Extension',
            'emailCounter': 1,
            'type': 'Email'
        };

        this._workspaceExtensionsService.addUpdateWorkspaceExtension(this.currentUser, workspaceExtensionObj, "")
            .subscribe((data: any) => {
                this._commonAppService.showSuccessMessage('Alert', data.result.message, function (alertRes) { });

                this.addUpdateEmailAutomation(emailCounter, data.result._id, birthDate, function (emailAutomationErr, emailAutomationRes) { });

            },
            (error: any) => {
                this._commonAppService.showErrorMessage('Alert', error, function (alertRes) { });
            });
    }

    public addUpdateEmailAutomation(emailCounter, workspaceExtensionId, birthDate, callback) {
        if (emailCounter > 0) {
            this._emailAutomationService.removeEmailAutomationByWorkExtId(this.currentUser, workspaceExtensionId)
                .subscribe((data: any) => {

                    var emailAutomationObject = {
                        'templateId': "5ad71d7471577daa38e33861",
                        'sendDate': birthDate,
                        'sendTime': "00:00",
                        'placeholders': {},
                        'workspaceExtensionId': workspaceExtensionId
                    }

                    let emailAutomationId = "";

                    this._emailAutomationService.addUpdateEmailAutomation(this.currentUser, emailAutomationObject, emailAutomationId)
                        .subscribe((data: any) => {
                            this._commonAppService.showSuccessMessage('Alert', data.result.message, function (alertRes) { });
                            callback(null, {});
                        },
                            (error: any) => {
                                this._commonAppService.showErrorMessage('Alert', error, function (alertRes) { });
                                callback(error, {});
                            });
                },
                    (error: any) => {
                        this._commonAppService.showErrorMessage('Alert', error, function (alertRes) { });
                        callback(error, {});
                    });

        } else {
            callback(null, {});
        }

    }

    public cancelRelationAddandEdit() {
        this.newClientName = '';
        this.relationObject['relation'] = '';
        this.relationObject['relativeClientId'] = '';
        this.isAddRelatives = false;
        this.isEditRelatives = false;
    }

    public saveRelation() {

        let isUpdate: any;
        this.relationObject['clientId'] = this._route.snapshot.params['clientId'];
        if (this.relationObject['relation'] == '') {
            this._commonAppService.showErrorMessage('Alert', 'Do have a relation and then click save button', function (alertRes) {
            });
        } else if (this.clientObject['gender'] == '') {
            this._commonAppService.showErrorMessage('Alert', 'Please update client gender before adding relatives!', function (alertRes) {
            });
        } else if (this.relationObject['relativeClientId'] == '') {
            this._commonAppService.showErrorMessage('Alert', 'Select the relative then try again!', function (alertRes) {
            });
        }
        else {
            this.checkIsValidRelationship(this.relationObject, (error, isValid)=>{
                if (isValid) {
                this._commonAppService.spinner.show();
            this._clientService.addAndUpdateRelation(this.currentUser, this.relationObject, this.relationObject['relativeId'])
                .subscribe(data => {
                    if (data.status == 1) {
                        this.newClientObject = {
                            "_id": "",
                            "firstName": "",
                            "middleName": "",
                            "lastName": "",
                            "telephone": "",
                            "birthDate": "",
                            "agent": {
                                "agentFirstName": "",
                                "agentLastName": "",
                                "agentId": ""
                            }
                        };
                        this.isAddRelatives = false;
                        this.relationObject['relativeClientId'] = '';
                        this.relationObject['relation'] = '';
                        this.newClientName = '';
                        this.getRelations();
                    }
                });
            }
            else {
                //alert
                this._commonAppService.showErrorMessage('Alert', error, function (alertRes) { });            }
            });

        }
    }
    public checkIsValidRelationship(relationObject, callback) {
        let currentClientBD = this.clientObject['birthDate'];
        let relatedClientBD;
        this._clientService.getClientById(this.currentUser, this.relationObject['relativeClientId'])
            .subscribe((data: any) => {
                if (data && data.status == '0') {
                    window.location.href = '/dashboard';
                } else {
                    setTimeout(() => {
                        let check =0;
                        if(data.result.client['gender']=='female'&& (relationObject.relation == 'Father' || relationObject.relation == 'Partner(Male)' || relationObject.relation == 'Husband' || relationObject.relation == 'Boyfriend' || 
                        relationObject.relation=='Son' ||
                        relationObject.relation=='Brother'||relationObject.relation == 'Grandfather' || relationObject.relation == 'Grandson' || relationObject.relation == 'Uncle')){
                            check=1;
                            callback("Female Gender client cannot have a male relationship!", false);
                        }
                        if(data.result.client['gender']=='male'&& (relationObject.relation == 'Mother' || relationObject.relation == 'Partner(Female)' || relationObject.relation == 'Wife' || relationObject.relation == 'Girlfriend' ||
                        relationObject.relation=='Daughter' ||
                        relationObject.relation=='Sister'|| relationObject.relation == 'Grandmother' || relationObject.relation == 'Granddaughter' || relationObject.relation == 'Aunt' ||
                        relationObject.relation == 'Niece')){
                            check=1;
                            callback("Male Gender client cannot have a female relationship!", false);
                        }
                        relatedClientBD = data.result.client['birthDate'];
                        if (relationObject['relation'] == 'Son' || relationObject['relation'] == 'Daughter' || relationObject['relation'] == 'Granddaughter' || relationObject['relation'] == 'Grandson') {
                            if (currentClientBD > relatedClientBD) {
                                callback('Illegal relationship!', false);
                            }
                            else {
                                if(check!=1)
                                callback('', true);
                            }
                        }
                        else if (relationObject['relation'] == 'Father' || relationObject['relation'] == 'Mother' || relationObject['relation'] == 'Grandmother' || relationObject['relation'] == 'Grandfather') {
                            if (currentClientBD < relatedClientBD) {
                                callback('Illegal relationship!', false);
                            }
                            else {
                                if(check!=1)
                                callback('', true);
                            }
                        }
                        else {
                            if(check!=1)
                            callback('', true);
                        }
                    }, 0);

                }
            },
                (error: any) => {
                    console.log(' Error while getClientById :  ' + JSON.stringify(error));
                });

    }
    public editRelation(relation) {
        this.newClientName = relation.relativeClientFirstName + ' ' + relation.relativeClientlastName;
        this.relationObject.relation = relation.relation;
        this.isEditRelatives = true;
        this.isAddRelatives = true;
        this.relationObject['clientId'] = this._route.snapshot.params['clientId'];
        this.relationObject['relativeClientId'] = relation.relativeClientId;
        this.relationObject['relativeId'] = relation.relativeId;
    }

    public deleteRelation(relativeClientId) {
        let clientId = this._route.snapshot.params['clientId'];
        this._commonAppService.spinner.show();
        this._clientService.deleteRelation(this.currentUser, relativeClientId)
            .subscribe(data => {
                if (data.status == 1) {
                    this.getRelations();
                } else {
                    console.log('error', data.result);
                }
            });
    }

    public typeaheadOnSelect(e: any): void {
        this.relationObject['relativeClientId'] = e.item._id;
    }

    public changeTypeaheadNoResults(e: boolean): void {
        this.typeaheadNoResults = e;
    }

    public onNameChange() {
        var result = this.newClientName.split(" ");

        if (!(result[0] == '')) {
            this.newClientObject['firstName'] = result[0];
            this.newClientObject['lastName'] = '';
        }
        if (!(result[1] == '')) {
            this.newClientObject['lastName'] = result[1];
        }
    }

    public checkGender() {
        if (!this.clientObject || this._commonAppService.isUndefined(this.clientObject['_id'])) {
            this._commonAppService.showErrorMessage('Alert', 'Please create client before adding relatives!', function (alertRes) { });
        } else if (this.clientObject['gender'] == '') {
            this._commonAppService.showErrorMessage('Alert', 'Please update client gender before adding relatives!', function (alertRes) { });
        } else {
            this.isAddRelatives = true;
            
            for(var i=0;i<this.allRelatives.length;i++)
            {
                if(this.allRelatives[i].relation === "Father")
                {
                  this.relationShipArray = this.relationShipArray.filter((item) => {
                        return item !== "Father"; 
                   })
                }

                if(this.allRelatives[i].relation === "Mother"){
                    this.relationShipArray = this.relationShipArray.filter((item) => {
                        return item !== "Mother"; 
                   });

                }

                if(this.allRelatives[i].relation === "Grandmother"){
                    this.relationShipArray = this.relationShipArray.filter((item) => {
                        return item !== "Grandmother"; 
                   });
                }

                if(this.allRelatives[i].relation === "Grandfather"){
                    this.relationShipArray = this.relationShipArray.filter((item) => {
                        return item !== "Grandfather"; 
                   });
                }
            }
        }
    }

    public getRelations() {
        let isUpdate: any;
        let clientId = this._route.snapshot.params['clientId'];
        this._clientService.getRelations(this.currentUser, clientId)
            .subscribe(data => {
                this.allRelatives = data.result.clients;
                this._commonAppService.spinner.hide();
            });
    }

    public getClientsForAgent(){

    }
    public getAllClients(data) {
        let anyData = {};
        let clientId = this._route.snapshot.params['clientId'];
        data.userId=this.clientObject['agent'].agentId;
        this._clientService.getAllClients(this.currentUser, data)
            .subscribe(data => { 
                if (data) {
                    this.allClients = data.result.clients;
                    this.allClients = this.allClients.filter(( obj ) => {
                        return obj._id !== clientId;
                    });
                    //var removeIndex = this.allClients.map((item) => { return item._id; }).indexOf(clientId);
                    //this.allClients.splice(removeIndex, 1);
                    let clientData = {};
                    this.statesComplex = [];
                    for (let i = 0; i < this.allClients.length; i++) {
                        clientData['name'] = this.allClients[i].firstName + " " + this.allClients[i].lastName;
                        clientData['_id'] = this.allClients[i]._id;
                        this.statesComplex.push({
                            name: clientData['name'],
                            _id: clientData['_id'],
                        });

                    }
                }
            });
    }

  

}
