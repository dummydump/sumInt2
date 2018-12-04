/**
 * Client Add Page Component.
 */
import { Component, ViewChild, NgModule, OnInit, Output, AfterViewInit, EventEmitter, OnDestroy, ElementRef, NgZone, Renderer, Directive, Inject, ViewContainerRef,  } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonAppService, ClientService, UserService, WorkspaceExtensionsService, EmailAutomationService } from '../../../services/index';
import { GlobalVariable } from '../../../services/static-variable';
import 'rxjs/add/observable/of';
import {MaskService} from 'ngx-mask';

@Component({
    providers: [
        CommonAppService,
        ClientService,
        WorkspaceExtensionsService,
        EmailAutomationService,
        MaskService
    ],
    styleUrls: ['./client-add.component.css'],
    templateUrl: './client-add.component.html'
})

export class ClientAddComponent implements OnInit, AfterViewInit {
    public currentUser: any;
    public clientEditPath = 'client/editClient/';
    public clientObject = {
        "_id": "",
        "firstName": "",
        "middleName": "",
        "lastName": "",
        "nickName": "",
        "birthDate": "",
        "anniversaryDate": "",
        "agent": {
            "agentFirstName": "",
            "agentLastName": "",
            "agentId": ""
        },
        "gender": "male",
        "mapAddress": "",
        "latitude": "",
        "longitude": "",
        "address1": "",
        "address2": "",
        "city": "",
        "state": "",
        "zipcode": "",
        "clientTags": [],
        "contactDetails": [],
        "additionalNotes": "",
        "passportDetails": [{
            "passportNumber": "",
            "issueDate": "",
            "expirationDate": "",
            "issueCity": "",
            "issueCountry": "",
        }],
        "workspaceExtensions": []
    };

    public newClientObject = {
        "_id": "",
        "firstName": "",
        "middleName": "",
        "lastName": "",
        "telephone": "",
        "birthDate": "",
    };

    public isAddContactDetail = false;
    public isContactEditMode = false;
    public contactDetailObject = {
        "detail": "",
        "detailType": "",
        "value": ""
    };
    public unchangedContactDetailObject = null;
    public agentsList: any[];
    public newClientName: string;

    public customSelected: any;
    public statesComplex = [];

    public relationShipArray = ['Father', 'Mother', 'Wife', 'Husband', 'Girlfriend', 'Boyfriend', 'Daughter', 'Sister'];
    public allClients = [];
    public relationObject = {
        clientId: '',
        relativeClientId: '',
        relation: ''
    };

    public clientWorkspaceExtensions = [];
    public clientEmailAutomations = [];

    public allRelatives = [];
    public typeaheadNoResults: boolean;
    public isAddRelatives: boolean;
    public isEditRelatives: boolean;
    public clientFound = "New Client";
    public clientTags = [];
    public TODAY;
    public editContactIndex = 0;

    public clientId = "";
    constructor(
        public _route: ActivatedRoute,
        public _router: Router,
        public _commonAppService: CommonAppService,
        public _clientService: ClientService,
        public _workspaceExtensionsService: WorkspaceExtensionsService,
        public _emailAutomationService: EmailAutomationService,
        public _userService: UserService,
        public _viewContainerRef: ViewContainerRef,
        public _MaskService: MaskService
    ) {

        this._commonAppService.getCurrentUserSession((user) => {
            this.currentUser = user;
            if (this._commonAppService.isUndefined(this.currentUser)) {
                window.location.href = '/login';
            } else {

                this.clientObject = {
                    "_id": "",
                    "firstName": "",
                    "middleName": "",
                    "lastName": "",
                    "nickName": "",
                    "birthDate": "",
                    "anniversaryDate": "",
                    "agent": {
                        "agentFirstName": "",
                        "agentLastName": "",
                        "agentId": ""
                    },
                    "gender": "male",
                    "mapAddress": "",
                    "latitude": "",
                    "longitude": "",
                    "address1": "",
                    "address2": "",
                    "city": "",
                    "state": "",
                    "zipcode": "",
                    "clientTags": [],
                    "contactDetails": [],
                    "additionalNotes": "",
                    "passportDetails": [{
                        "passportNumber": "",
                        "issueDate": "",
                        "expirationDate": "",
                        "issueCity": "",
                        "issueCountry": "",
                    }],
                    "workspaceExtensions": []
                };

                this.newClientObject = {
                    "_id": "",
                    "firstName": "",
                    "middleName": "",
                    "lastName": "",
                    "telephone": "",
                    "birthDate": "",
                };

                this.contactDetailObject = {
                    "detail": "",
                    "detailType": "",
                    "value": ""
                };

                this.clientId = _route.snapshot.params['clientId'];
                if (!this._commonAppService.isUndefined(this.clientId)) {
                    this.clientFound = " ";
                    this._clientService.getClientById(this.currentUser, this.clientId)
                        .subscribe((data: any) => {
                            console.log('data***'+JSON.stringify(data));
                            if (data && data.status == '0') {
                                window.location.href = '/dashboard';
                            } else {
                                setTimeout(() => {
                                    this.clientObject = data.result.client;
                                    this.clientTags = this.clientObject['clientTags'];
                                    this.clientObject['passportDetails'] = (this.clientObject['passportDetails'].length > 0) ? this.clientObject['passportDetails'] : [{
                                        "passportNumber": "",
                                        "issueDate": "",
                                        "expirationDate": "",
                                        "issueCity": "",
                                        "issueCountry": ""
                                    }];

                                    // this.clientObject['birthDate'] = "2018-05-01";

                                    this.getWorkspaceExtensionByClientId(this.clientId);

                                    this.agentSelectChange(this.clientObject.agent.agentId);
                                }, 0);

                            }
                        },
                        (error: any) => {
                            console.log(' Error while getClientById :  ' + JSON.stringify(error));
                        });
                }
                this.TODAY = this._commonAppService.getDateYYYYMMDD(new Date());
                this.getAgentList();
                // this.getAllClients();
                this.getRelations();
               
            }
        });
    }

    spinnerConfig = {
        bdColor: '#333',
        size: 'large',
        color: '#fff'
    }
    public ngOnInit() {

    }

    public ngAfterViewInit() {

    }

    public saveClient(flag) {

        if (!this._commonAppService.isUndefined(this.clientObject['firstName']) || !this._commonAppService.isUndefined(this.clientObject['lastName'])) {
              var patt = /\s/g;
              if(patt.test(this.clientObject['firstName']) || patt.test(this.clientObject['lastName'])){

                this._commonAppService.showErrorMessage('Alert', 'Spaces is not allowed', function(alertRes){});

              }else if(this.clientObject['firstName'].length <=1 || this.clientObject['lastName'].length <= 1){
                  this._commonAppService.showErrorMessage('Alert', 'First Name & Last Name should be atleast 2 alphabets each.', function(){});
              }
        }
        if (this._commonAppService.isUndefined(this.clientObject['firstName']) || this._commonAppService.isUndefined(this.clientObject['lastName'])) {
            this._commonAppService.showErrorMessage('Alert', this._commonAppService.requiredFieldMessage, function(alertRes) {});
        } else if ((this.clientObject['birthDate']) && this.clientObject['birthDate'] > this.TODAY) {
            this._commonAppService.showErrorMessage('Alert', 'Birth date must not be future date', function(alertRes) {});
        } 
         else if(!(this._commonAppService.isUndefined(this.clientObject['passportDetails'][0].issueDate)) && this.clientObject['birthDate'] > this.clientObject['passportDetails'][0].issueDate){
             this._commonAppService.showErrorMessage('Alert', 'Passport Issue Date must be after Birth Date', function(alertRes) {});
        }
          else if ( (this.clientObject['anniversaryDate']) && this.clientObject['anniversaryDate'] > this.TODAY) {
            this._commonAppService.showErrorMessage('Alert', 'Anniversary date must not be future date', function(alertRes) {});
        } else if ((this.clientObject['birthDate']) && this.clientObject['anniversaryDate'] && (this.clientObject['birthDate'] > this.clientObject['anniversaryDate'])) {
            this._commonAppService.showErrorMessage('Alert', 'Birth date must before than anniversary date', function(alertRes) {});
        } else {
            this.clientObject['clientTags'] = this.clientTags;

            this._clientService.addUpdateClient(this.currentUser, this.clientObject, this.clientObject['_id'], this.editContactIndex)
                .subscribe((data: any) => {

                    if (data.status == 1) {
                        this._commonAppService.showSuccessMessage('Alert', data.result.message, function(alertRes) {});
                    }
                    if (data.status == '1' && this.clientObject['_id'] == '') {
                        this.clientObject['_id'] = data.result._id;
                    } else if (data.status == 0) {
                        if (this.editContactIndex == 0)
                            this.clientObject['contactDetails'].pop();
                        this._commonAppService.showErrorMessage('Alert', data.result.error, function(alertRes) {});
                    }
                    
                    if(this.clientObject['birthDate'] || this.clientObject['anniversaryDate']){
                        this.addUpdateWorkspaceExtension(this.clientObject['_id'], flag);
                    } else if(!this.clientObject['birthDate'] && !this.clientObject['anniversaryDate'] && this.clientWorkspaceExtensions.length > 0){
                        this.removeWorkspaceExtensionById(this.clientWorkspaceExtensions[0]._id, true);
                    } else if (flag == true) {
                        this.closePage();
                    } else if(this._commonAppService.isUndefined(this.clientId)){
                        this.redirectToEditClient();
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

    public saveNewClient() {

    if (!this._commonAppService.isUndefined(this.clientObject['firstName']) || !this._commonAppService.isUndefined(this.clientObject['lastName'])) {
              var patt = /\s/g;
              if(patt.test(this.clientObject['firstName']) || patt.test(this.clientObject['lastName'])){

                this._commonAppService.showErrorMessage('Alert', 'Spaces is not allowed', function(alertRes){});

              }else if(this.clientObject['firstName'].length <=1 || this.clientObject['lastName'].length <= 1){
                  this._commonAppService.showErrorMessage('Alert', 'First Name & Last Name should be atleast 2 alphabets each.', function(){});
              }
        }
        if (this._commonAppService.isUndefined(this.newClientObject['firstName']) || this._commonAppService.isUndefined(this.newClientObject['lastName'])) {
            this._commonAppService.showErrorMessage('Alert', this._commonAppService.requiredFieldMessage, function(alertRes) {});
            return ;
        }
        
        //console.log(this.newClientObject.telephone);
        
        this.newClientObject['clientTags'] = this.clientTags;
        this._clientService.addUpdateClient(this.currentUser, this.newClientObject, '', this.editContactIndex)
            .subscribe((data: any) => {
                this._commonAppService.showSuccessMessage('Alert', data.result.message, function(alertRes) {});
                if (data.status == '1' && this.newClientObject['_id'] == '') {
                    this.getAllClients();
                    this.typeaheadNoResults = false;
                    this.relationObject['relativeClientId'] = data.result._id;
                    this.newClientName = this.newClientObject['firstName'] + ' ' + this.newClientObject['lastName'];
                    setTimeout(function() {
                        this.getRelations();
                    }, 5000);

                    if(this.newClientObject['birthDate']){
                        this.addUpdateWorkspaceExtension(this.clientObject['_id'], false);
                    } 
                }
            },
            (error: any) => {
                this._commonAppService.showErrorMessage('Alert', error, function(alertRes) {});
            });
        
    }

    public savePassportDetails(flag) {
        var issueDate = new Date(this.clientObject['passportDetails'][0].issueDate);
        var expireDate = new Date(this.clientObject['passportDetails'][0].expirationDate);
        if (this._commonAppService.isUndefined(this.clientObject['passportDetails'][0].passportNumber) || this._commonAppService.isUndefined(this.clientObject['passportDetails'][0].issueDate) || this._commonAppService.isUndefined(this.clientObject['passportDetails'][0].expirationDate)) {
            this._commonAppService.showErrorMessage('Alert', this._commonAppService.requiredFieldMessage, function(alertRes) {});
        } else if(this.clientObject['passportDetails'][0].issueDate < this.clientObject['birthDate']){
            this._commonAppService.showErrorMessage('Alert', 'Passport Issue Date must be after Birth Date', function(alertRes) {});
        }
        else if (issueDate > expireDate) {
            this._commonAppService.showErrorMessage('Alert', 'Issue date must before than expiration date', function(alertRes) {});
        } else {
            this.saveClient(false);
        }
    }

    public saveAdditionalNotes(flag) {

        if (this._commonAppService.isUndefined(this.clientObject['additionalNotes'])) {
            this._commonAppService.showErrorMessage('Alert', this._commonAppService.requiredFieldMessage, function(alertRes) {});
        } else {
            this.saveClient(false);
        }
    }

    public agentSelectChange(id) {

        if (this.agentsList) {
            let agent = this.agentsList.find(i => i._id == id);
            if (agent) {
                this.clientObject['agent'] = {
                    "agentId": agent._id,
                    "agentLastName": agent.firstName,
                    "agentFirstName": agent.lastName
                };
            }
        }
    }

    public EmailExists(aa, key, isEdit) {
        var counter = 0;
        for (var i = 0; i < aa.length; i++) {
            if (aa[i].value === key) {
                counter++;
                if (isEdit && counter > 1) {
                    return true
                }
            }
        }
        return false;
    }

    public addContact() {
    if (this._commonAppService.isUndefined(this.contactDetailObject['detail']) || this._commonAppService.isUndefined(this.contactDetailObject['detailType']) || this._commonAppService.isUndefined(this.contactDetailObject['value'])) {
         this._commonAppService.showErrorMessage('Alert', this._commonAppService.requiredFieldMessage, function(alertRes) {});
         return false;
     }
     if ((this.contactDetailObject['detail'] == 'Email Address' && !this._commonAppService.isValidEmail(this.contactDetailObject['value']))) {
         this._commonAppService.showErrorMessage('Alert', 'Please enter valid email address', function(alertRes) {});
         return false;
     }

     if(this.contactDetailObject['detail']=='Telephone' )
     {
         if(!this._commonAppService.isValidTelephone(this.contactDetailObject['value']) )
         {
            this._commonAppService.showErrorMessage('Alert', 'Telephone number format not valid', function(alertRes) {});
            return false;
         }
     }

         if (this.EmailExists(this.clientObject['contactDetails'], this.contactDetailObject['value'], this.isAddContactDetail)) {
             this._commonAppService.showErrorMessage('Alert', 'email address already exist', function(alertRes) {});
             return false;
         }
         if ((this.contactDetailObject['detail'] != '' && this.contactDetailObject['detailType'] != '') && this.contactDetailObject['value'] != '') {
             if (this.validateDuplicateContact()) {
                 return false;
           }

             if (this.isContactEditMode == false) {
                 this._commonAppService.spinner.show();

                 setTimeout(() => {
                     this._commonAppService.spinner.hide();
                 }, 500);
                 this.clientObject['contactDetails'].push(this.contactDetailObject);

             } else {
                 //update original contact model with edited values.
                 this.updateContact();
             }
             this.isAddContactDetail = false;
             this.clearContact();
             this.saveClient(false);
         }

    }

    public removeContact(contact) {

        this._commonAppService.openConfirmDialog('Confirm', this._commonAppService.removeConfirmMessage, (confirmRes) => {
            if (confirmRes == true) {
                if (this.clientObject['contactDetails'] && this.clientObject['contactDetails'].length > 0) {
                    let index: number = this.clientObject['contactDetails'].indexOf(contact);
                    if (index !== -1) {
                        this.clientObject['contactDetails'].splice(index, 1);
                        this.saveClient(false);
                    }
                }
            }
        });
    }

    public editContact(contact) {

        this.isAddContactDetail = true;
        this.isContactEditMode = true;
        setTimeout(() => {
            this.contactDetailObject = Object.assign({}, contact);
        }, 800);
        this.unchangedContactDetailObject = contact;
    }

    public updateContact() {
        if (this.isContactEditMode) {
            this.unchangedContactDetailObject.detail = this.contactDetailObject.detail;
            this.unchangedContactDetailObject.detailType = this.contactDetailObject.detailType;
            this.unchangedContactDetailObject.value = this.contactDetailObject.value;
        }
    }
    public clearContact() {

        this.isAddContactDetail = false;
        if (this.isContactEditMode) {
            this.contactDetailObject.detail = this.unchangedContactDetailObject.detail;
            this.contactDetailObject.detailType = this.unchangedContactDetailObject.detailType;
            this.contactDetailObject.value = this.unchangedContactDetailObject.value;
        } else {
            this.contactDetailObject = {
                "detail": "",
                "detailType": "",
                "value": ""
            };
        }
    }

    public getFormattedValue(contact) {
        if (contact.detail === 'Telephone'|| contact.detail === 'Fax') {
            return this._MaskService.applyMask(contact.value, '000-000-0000');
        } else {
            return contact.value;
        }
    }

    public closePage() {
        this._router.navigate(['clients']);
    }

    public getAllClients() {

        let anyData = {};
        let clientId = this._route.snapshot.params['clientId'];
        this._clientService.getAllClients(this.currentUser, anyData)
            .subscribe(data => {
                if (data) {
                    this.allClients = data.result.clients;
                    var removeIndex = this.allClients.map(function(item) {
                        return item._id;
                    }).indexOf(clientId);
                    this.allClients.splice(removeIndex, 1);
                    let clientData = {};
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

    public typeaheadOnSelect(e: any): void {

        this.relationObject['relativeClientId'] = e.item._id;
    }

    public changeTypeaheadNoResults(e: boolean): void {
        this.typeaheadNoResults = e;
    }

    public onNameChange() {
        var result = this.newClientName.split(" ");
        this.newClientObject['firstName'] = result[0];

        if (result[1]) {
            this.newClientObject['lastName'] = result[1];
        }
    }

    public checkGender() {
        if (this.clientObject['gender'] == '') {
            this._commonAppService.showErrorMessage('Alert', 'Please update client gender before adding relatives!', function(alertRes) {});
        } else {
            this.isAddRelatives = true;
        }
    }

    public saveRelation() {

        let isUpdate: any;
        this.relationObject['clientId'] = this._route.snapshot.params['clientId'];

        if (this.relationObject['relation'] == '') {
            this._commonAppService.showErrorMessage('Alert', 'Do have a relation and then click save button', function(alertRes) {});
        } else if (this.clientObject['gender'] == '') {
            this._commonAppService.showErrorMessage('Alert', 'Please update client gender before adding relatives!', function(alertRes) {});
        } else if (this.relationObject['relativeClientId'] == '') {
            this._commonAppService.showErrorMessage('Alert', 'Select the relative then try again!', function(alertRes) {});
        } else {

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
                        };
                        this.isAddRelatives = false;
                        this.relationObject['relativeClientId'] = '';
                        this.relationObject['relation'] = '';
                        this.newClientName = '';
                        this.getRelations();
                    }

                });
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

    public cancelRelationAddandEdit() {

        this.newClientName = '';
        this.relationObject['relation'] = '';
        this.relationObject['relativeClientId'] = '';
        this.isAddRelatives = false;
        this.isEditRelatives = false;
    }

    public getAgentList() {

        this._userService.getAllAgents(this.currentUser, {})
            .subscribe((data: any) => {
                if (data.status == '1') {
                    if (this.currentUser.user && this._commonAppService.isManagerOrAdmin(this.currentUser.user.roleName)) {
                        this.agentsList = data.result.users;
                    } else {
                        let _agentsList = data.result.users;
                        this.agentsList = _agentsList.filter(item => item._id == this.currentUser.user._id);
                        this.clientObject['agent'] = {
                            "agentId": this.currentUser.user._id,
                            "agentLastName": this.currentUser.user.firstName,
                            "agentFirstName": this.currentUser.user.lastName
                        };
                    }
                }
            },
            (error: any) => {
                console.log(' Error while getAllAgents :  ' + JSON.stringify(error));
            });

    }

    public openMyClient(): void {
        this._router.navigate(['/clients']);
    }

    public updateClient(): void {
        // let clientId = this._route.snapshot.params['clientId'];
        // this._router.navigate(['/client/update', clientId]);
    }

    public validatePassportDate(oldValue) {

        let _passport = this.clientObject['passportDetails'][0];
        console.log(Date.parse(_passport.issueDate));
        if (_passport.issueDate && _passport.expirationDate) {
            if (_passport.issueDate > _passport.expirationDate) {

            }
        }

    }
    public validateDuplicateContact() {

        for (let i = 0; i < this.clientObject['contactDetails'].length; i++) {
            if (this.clientObject['contactDetails'][i].value == this.contactDetailObject.value) {
                this._commonAppService.showErrorMessage('Alert', "This contact detail already exists!", function(alertRes) {});
                return true;
            }
        }
        return false;
    }

    public getWorkspaceExtensionByClientId(clientId) {
        this._workspaceExtensionsService.getWorkspaceExtensionByClientId(this.currentUser, clientId)
            .subscribe((data: any) => {
                if (data && data.status == '1' && data.result) {
                    this.clientWorkspaceExtensions = data.result.workspaceExtensions;

                    var workspaceExtensionIds = this.clientWorkspaceExtensions.map(a => a._id);

                    this._emailAutomationService.getEmailAutomationByWorkspaceExtIds(this.currentUser, workspaceExtensionIds)
                        .subscribe((data: any) => {
                            if (data && data.status == '1' && data.result) {
                                this.clientEmailAutomations = data.result.emailAutomations;
                            } 
                        },
                        (error: any) => {
                            console.log(' Error while getEmailAutomationByWorkspaceExtIds :  ' + JSON.stringify(error));
                        });
                } 
            },
            (error: any) => {
                console.log(' Error while getWorkspaceExtensionByClientId :  ' + JSON.stringify(error));
            });
        
    }
    
    public removeWorkspaceExtensionById(workspaceExtensionId, flag) {
        if(flag){
            this.removeWSE(workspaceExtensionId);
        } else {
            this._commonAppService.showConfirmDialog(this._commonAppService.removeConfirmMessage, function (confirmRes) {
                if (confirmRes == true) {
                    this.removeWSE(workspaceExtensionId);
                } 
            });
        }
    }

    public removeWSE(workspaceExtensionId){
        this._workspaceExtensionsService.removeWorkspaceExtensionById(this.currentUser, workspaceExtensionId)
        .subscribe((data: any) => {
            this.removeEmailAutomation(workspaceExtensionId);
            this.getWorkspaceExtensionByClientId(this.clientObject['_id']);
            this._commonAppService.showSuccessMessage('Alert', data.result.message, function (alertRes) { });
        },
        (error: any) => {
            this._commonAppService.showErrorMessage('Alert', error, function (alertRes) { });
        });
    }

    public addUpdateWorkspaceExtension(clientId, flag) {
        let emailCounter = 0;
        let emailDateList = [];
        if(this.clientObject['birthDate'] && this.clientObject['anniversaryDate']){
            emailDateList.push(this.clientObject['birthDate']);
            emailDateList.push(this.clientObject['anniversaryDate']);
            emailCounter = 2;
        } else if((this.clientObject['birthDate'] && !this.clientObject['anniversaryDate']) || (!this.clientObject['birthDate'] && this.clientObject['anniversaryDate'])){
            emailDateList.push((this.clientObject['birthDate'])? this.clientObject['birthDate'] : this.clientObject['anniversaryDate']);
            emailCounter = 1;
        }

        let workspaceExtensionObj = {
            'clientId': clientId,
            'title': 'Birthday-Anniversary Extension',
            'emailCounter': emailCounter,
            'type': 'Email'
        };

        let workspaceExtensionId = (this.clientWorkspaceExtensions.length > 0)? this.clientWorkspaceExtensions[0]._id : "";

        this._workspaceExtensionsService.addUpdateWorkspaceExtension(this.currentUser, workspaceExtensionObj, workspaceExtensionId)
            .subscribe((data: any) => {
                this._commonAppService.showSuccessMessage('Alert', data.result.message, function (alertRes) { });
                this.getWorkspaceExtensionByClientId(this.clientObject['_id']);

                let _extId = data.result._id;

                this.addUpdateEmailAutomation(emailCounter, _extId, emailDateList, (emailAutomationErr, emailAutomationRes)=> {
                    if (flag == true) {
                        this.closePage();
                    } else if(this._commonAppService.isUndefined(this.clientId)) {
                        this.redirectToEditClient();
                    }
                });
            },
            (error: any) => {
                this._commonAppService.showErrorMessage('Alert', error, function (alertRes) { });
                if (flag == true) {
                    this.closePage();
                }
            });
    }

    public removeEmailAutomation(workspaceExtensionId) {
        this._emailAutomationService.removeEmailAutomationByWorkExtId(this.currentUser, workspaceExtensionId)
        .subscribe((data: any) => {
            this.getWorkspaceExtensionByClientId(this.clientObject['_id']);
        },
        (error: any) => {
            this._commonAppService.showErrorMessage('Alert', error, function (alertRes) { });
        });
    }

    public validatePassportNumber(value:string){
       if(value.length > 100){
           this.clientObject['passportDetails'][0].passportNumber = '';
       }else {
           this.clientObject['passportDetails'][0].passportNumber = value;
       }
    }

    public addUpdateEmailAutomation(emailCounter, workspaceExtensionId, emailDateList, callback) {
        if(emailCounter > 0){
            this._emailAutomationService.removeEmailAutomationByWorkExtId(this.currentUser, workspaceExtensionId)
            .subscribe((data: any) => {
                this.clientEmailAutomations = [];

                for(let i=0; i<emailCounter; i++){
                    var emailAutomationObject = {
                        'templateId': "5ad71d7471577daa38e33861",
                        'sendDate': emailDateList[i],
                        'sendTime': "00:00",
                        'placeholders': {},
                        'workspaceExtensionId': workspaceExtensionId
                    }

                    let emailAutomationId = "";

                    this._emailAutomationService.addUpdateEmailAutomation(this.currentUser, emailAutomationObject, emailAutomationId)
                        .subscribe((data: any) => {
                            this._commonAppService.showSuccessMessage('Alert', data.result.message, function (alertRes) { });
                            this.getWorkspaceExtensionByClientId(this.clientObject['_id']);
                            if((i + 1) >= emailCounter){
                            callback(null, {});
                            }
                        },
                        (error: any) => {
                            this._commonAppService.showErrorMessage('Alert', error, function (alertRes) { });
                            callback(error, {});
                        });
                }
            },
            (error: any) => {
                this._commonAppService.showErrorMessage('Alert', error, function (alertRes) { });
                callback(error, {});
            });
            
        } else {
            callback(null, {});
        }
        
    }

    public redirectToEditClient(){
        this._router.navigate([this.clientEditPath + this.clientObject['_id']]);
    }
}