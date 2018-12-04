/**
 * Clients View Page Component.
 */
// tslint:disable-next-line:max-line-length
import { Component, ViewChild, NgModule, OnInit, Output, AfterViewInit, EventEmitter, OnDestroy, ElementRef, NgZone, Renderer, Directive, Inject, ViewContainerRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonAppService, ClientService } from '../../../services/index';
import { GlobalVariable } from '../../../services/static-variable';
import * as XLSX from 'xlsx';
import { element } from 'protractor';
import { MaskService } from 'ngx-mask';


@Component({
    providers: [
        CommonAppService,
        ClientService,
        MaskService,

    ],
    styleUrls: ['./clients-view.component.css'],
    templateUrl: './clients-view.component.html'
})

export class ClientsViewComponent implements OnInit, AfterViewInit {
    public currentUser: any;
    public clientsList = [];
    public pageCount = 0;
    public limit = 10;
    public totalRecords = 0;
    public currentPageCount = 0;
    public pagerList = [];
    public currentSearchKey = '';
    public currentSearchValue = '';
    public searchObject = {};
    public isSearching = false;
    public file: any[] = [];
    public fileFound: boolean;
    public totalImportedCount = -1;
    public totalRejecedContact = 0;
    public dataTarget;
    public fileIsOver: boolean = false;
    public importErrors = [];
    public isimportErrors = false;
    public isSpinner = true;
    public importErrorMessage = '';
    public beforeFileDrop = 'Drop File Here';
    public pgList = {};

    @ViewChild('closeImport1Btn') closeImport1Btn: ElementRef;
    @ViewChild('closeImport3Btn') closeImport3Btn: ElementRef;
    @ViewChild('openImport3Btn') openImport3Btn: ElementRef;

    constructor(
        public _route: ActivatedRoute,
        public _router: Router,
        public _commonAppService: CommonAppService,
        public _clientService: ClientService,
        public _viewContainerRef: ViewContainerRef,
        public _MaskService: MaskService,

    ) {
        this.searchObject = { 'firstName': '', 'lastName': '', 'address': '', 'telephone': '', 'email': '', 'agent': '' };


        this._commonAppService.getCurrentUserSession((user) => {
            this.currentUser = user;
            if (_commonAppService.isUndefined(this.currentUser)) {
                window.location.href = '/login';
            }
        });
    }
    
    spinnerConfig = {
        bdColor: '#333',
        size: 'large',
        color: '#fff'
    };
    public ngOnInit() {
        this.searchObject = { 'firstName': '', 'lastName': '', 'address': '', 'telephone': '', 'email': '', 'agent': '' };
        this.getClientList(0, 10);
    }

    public ngAfterViewInit() {
    }

    public setPageLimit(option) {
        this.limit = parseInt(option);
        this.getClientList(0, this.limit);
    }

    public currentPageCountEvent($event){
        this.currentPageCount = $event;
        this.getClientList(this.currentPageCount, this.limit);
    }
    
    public limitChangeEvent($event){
        this.limit = $event;
        this.getClientList(0, this.limit);
    }

    public getClientList(pageCount, limit) {

        // pageCount = this.getPageCounter(this.searchObject);


        // this.currentPageCount = (this.isSearching && this.pgList['pages'] && this.pgList['pages'].length < 2)? 0 : pageCount;

        this.currentPageCount = pageCount;


        let data = { 'pageCount': this.currentPageCount, 'limit': limit };
        data['search'] = this.searchObject;

        // if(!this.isSearching)
        if (this.isSpinner && !this.isSearching) {
            this._commonAppService.spinner.show();
        }

        this._clientService.getClients(this.currentUser, data)
            .subscribe((data: any) => {
                if (data.status == '1') {
                    setTimeout(() => {
                        console.log(data.result);
                        this.clientsList = data.result.clients;
                        this.totalRecords = data.result.totalRecords;
                        let _pList = this._commonAppService.getPagerList(this.totalRecords, this.limit, this.currentPageCount);
                        this.pgList = (_pList) ? _pList : [];
                    }, 0);
                } else {
                    this.clientsList = [];
                    this.totalRecords = 0;
                    this.pagerList = [];
                    this.pgList['pages'] = [];
                }

                setTimeout( () => {
                    this._commonAppService.spinner.hide();
                }, 1000);
                this.isSpinner = true;
            },
            (error: any) => {
                console.log(' Error while getClients :  ' + JSON.stringify(error));
                this._commonAppService.spinner.hide();
            });
    }

    public removeClientById(clientId) {
        this._clientService.getTripsByClientId(this.currentUser, clientId)
            .subscribe(data => {
                if (data.result.totalTrips > 0) {
                    // tslint:disable-next-line:max-line-length
                    this._commonAppService.showConfirmDialog('You need to delete ' + data.result.totalTrips + ' trips asscociated with this client first!', function (alertRes) { });
                } else {
                    this._commonAppService.showConfirmDialog(this._commonAppService.removeConfirmMessage,  (confirmRes) => {
                        if (confirmRes == true) {
                            this._clientService.removeClientById(this.currentUser, clientId)
                                .subscribe((data: any) => {
                                    this._commonAppService.showSuccessMessage('Alert', data.result.message, function (alertRes) { });
                                    this.getClientList(0, 10);
                                },
                                (error: any) => {
                                    this._commonAppService.showErrorMessage('Alert', error, function (alertRes) { });
                                });
                        }
                    });
                }
            });

    }

    public onSearchChange(searchKey, searchValue) {
        this.checkIsSearching();
        // this.currentSearchKey = searchKey;
        // this.currentSearchValue = searchValue;
        this.getClientList(0, this.limit);
    }

    public refreshClientList() {
        this.currentSearchKey = '';
        this.currentSearchValue = '';
        this.searchObject = { 'firstName': '', 'lastName': '', 'address': '', 'telephone': '', 'email': '', 'agent': '' };
        this.clientsList = [];
        this.pageCount = 0;
        this.limit = 10;
        this.totalRecords = 0;
        this.currentPageCount = 0;
        this.pagerList = [];
        this.pgList['pages'] = [];

        this.getClientList(0, this.limit);
    }

    public checkIsSearching() {
        this.isSearching = false;
        for (var i in this.searchObject) {
            if (this.searchObject[i] != '') {
                this.isSearching = true;
            }
        }
    }

    public getClientContactEmail(contactDetails) {
        let _count = -1;
        let _email = '';
        let _returnValue = '';
        let _hasValue = false;
        if (contactDetails) {
            contactDetails.forEach((element, index) => {
                if (element.detail == 'Email Address') {
                    _count++;
                    if (_hasValue == false) {
                        _email = element.value;
                        _hasValue = true;
                    }
                }
            });
            if (_count == 0 || _count == -1) {
                return _email;
            } else {
                return _email + ' ' + '/+' + ((_count == -1) ? 0 : _count) + 'additional';
            }
        } else {
            return _returnValue;
        }
    }

    public getClientContactTelephone(contactDetails) {
        let _count = -1;
        let _telephone = '';
        let _returnValue = '';
        let _hasValue = false;
        if (contactDetails) {
            contactDetails.forEach((element, index) => {
                if (element.detail == 'Telephone' && element.detailType == 'Home') {
                    _count++;
                    if (_hasValue == false) {
                        _telephone = element.value;
                        _hasValue = true;
                    }
                }
            });
            if(_count == -1){
                contactDetails.forEach((element, index) => {
                    if (element.detail == 'Telephone' && element.detailType == 'Mobile') {
                        _count++;
                        if (_hasValue == false) {
                            _telephone = element.value;
                            _hasValue = true;
                        }
                    }
                }); 
            }
            if(_count == -1){
                contactDetails.forEach((element, index) => {
                    if (element.detail == 'Telephone' && element.detailType == 'Other') {
                        _count++;
                        if (_hasValue == false) {
                            _telephone = element.value;
                            _hasValue = true;
                        }
                    }
                }); 
            }
            if(_count == -1){
                contactDetails.forEach((element, index) => {
                    if (element.detail == 'Telephone' && element.detailType == 'Work') {
                        _count++;
                        if (_hasValue == false) {
                            _telephone = element.value;
                            _hasValue = true;
                        }
                    }
                }); 
            }

            if (_count == -1) {
                return _telephone;
            } else {
                return this.getFormattedValue(_telephone) ;
            }
        } else {
            return _returnValue;
        }
    }

    public importClient(files) {
        this.importErrorMessage = '';
        this._commonAppService.checkExcelCSVFile(files[0].name,  (isValidFile, ext) => {
            if (isValidFile) {
                this._clientService.importClient(this.currentUser, files[0], ext)
                    .subscribe((data: any) => {
                        if (data.status == '1') {
                            this.importErrors = data.result.notSaved;
                            if (this.importErrors.length == 0) {
                                this.isimportErrors = false;
                            } else {
                                this.isimportErrors = true;
                            }
                            this.totalRejecedContact = this.importErrors.length;
                            this.totalImportedCount = data.result.totalSavedCount;
                            this.isSpinner = false;
                            this.refreshClientList();
                            this._commonAppService.showSuccessMessage('Alert', data.result.message, function (alertRes) { });
                        } else {
                            var _errorMsg = data.result.message;
                            if (data.result.errorType && data.result.errorType === 'COLUMN_POSITION') {
                                _errorMsg = _errorMsg + ' Click on \'download\' menu icon to download the correct file format';
                            }
                            this.importErrorMessage = _errorMsg;
                            // tslint:disable-next-line:max-line-length
                            this._commonAppService.showErrorMessage('Alert', 'Selected file data is not valid. Download the sample file and try again.', function (alertRes) { });
                        }
                    },
                    (error: any) => {
                        this._commonAppService.showErrorMessage('Alert', error, function (alertRes) { });
                    });
            } else {
                this._commonAppService.showErrorMessage('Alert', 'Select Excel Sheet', function (alertRes) { });
            }
        });
    }

    public downloadErrors() {
        let exporterrorData = [
            [
                "First Name",
                "Middle Name",
                "Last Name",
                "Birth Date (mm/dd/yyyy)",
                "Mobile phone",
                "Home phone",
                "Email",
                "Gender (M/F)",
                "Address1",
                "Address2",
                "City",
                "State",
                "Zip Code",
                "Reason"
            ]
        ];
        var data = this.importErrors;
        if (data.length == 0) {
            return;
        }
        let _clients = this.importErrors;
        for (let index = 0; index < data.length; index++) {
             var rowdata =  data[index];
             var strt;
             if (rowdata.length > 13) {
                rowdata.splice(-2, 1);
            }

            exporterrorData.push(rowdata);
        }
        /* generate worksheet */
        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(exporterrorData);

        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        /* save to file */
        XLSX.writeFile(wb, 'Error_' + new Date().getTime() + '.xlsx', { bookSST: true });
    }

    public selectClient(files) {
        this.file = files;

        if (!(this.file)) {
            console.log('file not found');
            this._commonAppService.showErrorMessage('Alert', 'Select Excel Sheet', function (alertRes) { });
        } else if (this.file) {
            this.fileFound = true;
            this.beforeFileDrop = this.file[0].name;
        }
    }

    public checkForFile() {

        if ((this.file.length <= 0)) {
            this._commonAppService.showErrorMessage('Alert', 'File not found!', function (alertRes) { });
        } else {
            this.beforeFileDrop = this.file[0].name;
            this.fileFound = true;
        }
    }

    public clientImport() {
        if ((this.file.length <= 0)) {
            this._commonAppService.showErrorMessage('Alert', 'File not found!', function (alertRes) { });
        } else if (this.file.length > 0) {
            this.dataTarget = '#import3';
            this.fileFound = true;
            this.beforeFileDrop = this.file[0].name;
            this.importClient(this.file);
        }

    }

    public exportClients() {
        let exportData = [
            [
                'First Name',
                'Middle Name',
                'Last Name',
                'Birth Date',
                'Email',
                'Gender (M/F)',
                'Address1',
                'Address2',
                'City',
                'State',
                'Zip Code'
            ]
        ];

        this._clientService.getAllClients(this.currentUser, {})
            .subscribe((data: any) => {

                if (data.status == '1') {
                    // this._commonAppService.showSuccessMessage('Alert', data.result.message, function(alertRes){});
                    if (data.result.totalRecords == 0) {
                        this._commonAppService.showErrorMessage('Alert', 'No Clients Found', function (alertRes) { });
                    } else {
                        let _clients = data.result.clients;
                        _clients.forEach(element => {
                            let _obj = [
                                element.firstName,
                                element.middleName,
                                element.lastName,
                                element.birthDate,
                                this.getEmailFromContactDetails(element.contactDetails),
                                element.Gender,
                                element.address1,
                                element.address2,
                                element.city,
                                element.state,
                                element.zipcode
                            ];
                            exportData.push(_obj);
                        });
                        console.log(' exportData ' + JSON.stringify(exportData));
                        /* generate worksheet */
                        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(exportData);

                        /* generate workbook and add the worksheet */
                        const wb: XLSX.WorkBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

                        /* save to file */
                        XLSX.writeFile(wb, 'Clients_' + new Date().getTime() + '.xlsx', { bookSST: true });
                    }
                }
            },
            (error: any) => {
                this._commonAppService.showErrorMessage('Alert', error, function (alertRes) { });
            });
            
    }

    public getEmailFromContactDetails(contactDetails) {
        let _email = '';
        if (!contactDetails || contactDetails.length <= 0) {
            return _email;
        } else {
            contactDetails.forEach(element => {
                if (element.detail == 'Email Address') {
                    _email = element.value;
                }
            });
            return _email;
        }
    }
    public fileOver(fileIsOver: boolean): void {
        console.log('file is dropped');
        this.fileIsOver = fileIsOver;
    }

    public onFileDrop(file): void {
        this.file[0] = file;
        if (this.file[0]) {
            this.beforeFileDrop = this.file[0].name;
        }
        this.selectClient(this.file);
    }
    public getFormattedValue(phoneno) {
        return this._MaskService.applyMask(phoneno, '000-000-0000');

    }

    public selectFile() {
        let element: HTMLElement = document.querySelector('input[type="file"]') as HTMLElement;
        element.click();
    }
}
