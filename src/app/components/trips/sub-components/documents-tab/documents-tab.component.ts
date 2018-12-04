/**
 * Documents Tab Page Component.
 */
import { Component, ViewChild, NgModule, OnInit, Output, AfterViewInit, EventEmitter, OnDestroy, ElementRef, NgZone, Renderer, Directive, Inject, ViewContainerRef, Input, SimpleChanges } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonAppService, TripService, UserService, DocumentService } from '../../../../services/index';
import { GlobalVariable } from '../../../../services/static-variable';
import { HttpEventType } from '@angular/common/http';
import { SettingsService } from '../../../../services/settings.service';

@Component({
    providers: [
        CommonAppService,
        TripService,
        UserService, DocumentService, SettingsService
    ],
    selector: 'documents-tab',
    styleUrls: ['./documents-tab.component.css'],
    templateUrl: './documents-tab.component.html'
})

export class DocumentsTabComponent implements OnInit, AfterViewInit {
    public currentUser: any;
    public newDocuments = [];
    public existingDocuments = [];
    public pageCount = 0;
    public limit = 10;
    public totalRecords = 0;
    public currentPageCount = 0;
    public pagerList = [];
    public extensionList = [];
    public fileIsOver: boolean = false;
    public file: any[] = [];
    // public clientId: any;
    public show = true;
    public savingInProgress = false;
    public editDocument = null;
    public pgList = {
    };
    @Input('tripObject') tripObject;
    @Output() updateCount = new EventEmitter();

    public beforeFileDrop = 'Drop File Here';
    spinnerConfig = {
        bdColor: '#333',
        size: 'large',
        color: '#fff'
    }
    constructor(
        public _route: ActivatedRoute,
        public _router: Router,
        public _commonAppService: CommonAppService,
        public _tripService: TripService,
        public _userService: UserService,
        public _viewContainerRef: ViewContainerRef,
        public _documentService: DocumentService,
        public _settingService: SettingsService

    ) {
        // this.clientId = _route.snapshot.params['clientId'];

        this._commonAppService.getCurrentUserSession((user) => {
            this.currentUser = user;
            if (this._commonAppService.isUndefined(this.currentUser)) {
                window.location.href = '/login';
            }
        });
        this.getValidFileExtension();
    }

    public ngOnInit() {
    }
    ngOnChanges(changes: SimpleChanges) {
        if (changes.tripObject) {
            if (!this._commonAppService.isUndefined(this.tripObject) &&
                !this._commonAppService.isUndefined(this.tripObject._id)) {
                this.getDocuments(this.pageCount, this.limit);
                //this.doAsyncTask();
            }
        }

    }
    public ngAfterViewInit() {

    }
    public refresh(pageCount) {
        if (this._commonAppService.isUndefined(this.tripObject._id)) {
            return;
        }
        this.newDocuments = [];
        this.getDocuments(pageCount, this.limit);
    }
    public getDocuments(pageCount, limit) {

        this.currentPageCount = pageCount;

        let data = {
            pageCount: pageCount,
            limit: limit,
            tripId: this.tripObject._id
        };

        this._commonAppService.spinner.show();
        this._documentService.getDocuments(this.currentUser, data)
            .subscribe((data: any) => {
                if (data.status == '1') {
                    this.existingDocuments = data.result.documents.map((_d) => {
                        _d.isUploaded = true;
                        _d.percentDone = 100;
                        _d.isNew = false;
                        return _d;
                    });
                    this.totalRecords = data.result.totalRecords;
                    this.updateCount.emit({ documents: this.totalRecords });
                    let _pList = this._commonAppService.getPagerList(this.totalRecords, this.limit, pageCount);
                    this.pgList = (_pList) ? _pList : [];
                    this.show = false;
                    this._commonAppService.spinner.hide();
                } else {
                    this.existingDocuments = [];
                    this.totalRecords = 0;
                    this.updateCount.emit({ documents: this.totalRecords });
                    this.pagerList = [];
                    this.pgList = [];
                    this.show = false;
                    this._commonAppService.spinner.hide();
                }
            },
                (error: any) => {
                    console.log(' Error while getAllTrips :  ' + JSON.stringify(error));
                });
        setTimeout(() => {
            this._commonAppService.spinner.hide();
        }, 1000);
    }
    // Add new document
    public selectDocument(files) {

        var _file;
        if (files.length == undefined) {
            _file = files;
        } else {
            _file = files[0];
        }
        var _document = {
            _id: 0,
            fileName: _file.name,
            size: _file.size,
            sharedWith: '',
            uploadedBy: this.currentUser.user.firstName + " " + this.currentUser.user.lastName,
            uploadedDate: new Date(),
            file: _file,
            isUploaded: false,
            percentDone: 0,
            isNew: true,
            tripId: this.tripObject._id //this.clientId
        };
        this.newDocuments.unshift(_document);
        if (this.pgList['pages'] && this.pgList['pages'].length === 0) {
            let _pList = this._commonAppService.getPagerList(this.newDocuments.length, this.limit, 0);
            this.pgList = (_pList) ? _pList : [];
        }
        // this.existingDocuments.unshift(_document);
    }
    // Edit existing document
    public selectEditDocument(files) {

        let _file = files[0];
        this.editDocument.file = _file;
        this.editDocument.fileName = _file.name;
        this.editDocument.size = _file.size;
        this.editDocument.isUploaded = false;
        this.editDocument.uploadedDate = new Date();
        this.editDocument.percentDone = 0;
    }

    public uploadAll() {
        if (this._commonAppService.isUndefined(this.tripObject._id)) {
            this._commonAppService.showErrorMessage('Alert', this._commonAppService.TripNotFoundMessage, function (alertRes) {
            });
            return;
        }
        for (var i = 0; i < this.newDocuments.length; i++) {
            if (!this.newDocuments[i].isUploaded) {
                //   this.uploadDocument(this.newDocuments[i]);
                var _document = this.newDocuments[i];
                this.saveDocument(_document);
            }
        }
        for (var i = 0; i < this.existingDocuments.length; i++) {
            if (!this.existingDocuments[i].isUploaded) {
                //   this.uploadDocument(this.newDocuments[i]);
                _document = this.existingDocuments[i];
                this.saveEditedDocument(_document);
            }
        }
    }
    public uploadDocument(_document, callback) {
        let fileExtension = _document.fileName.substring(_document.fileName.lastIndexOf('.') + 1);
        if (this.extensionList.indexOf(fileExtension) == -1) {
            this._commonAppService.showErrorMessage('Invalid File Extension', _document.fileName + ' cannot be uploaded', function (resCallback) { });
            return;
        }
        this.savingInProgress = true;
        this._documentService.uploadDocument(this.currentUser, _document.file, _document.tripId, false)
            .subscribe((event: any) => {
                switch (event.type) {

                    // handle the upload progress event received
                    case HttpEventType.UploadProgress:
                        const percentDone = Math.round(100 * event.loaded / event.total);
                        _document.percentDone = percentDone;
                        break;
                    // handle the response event received
                    case HttpEventType.Response:
                        // When getting the full response body
                        var res = event.body;
                        if (res.status == '1') {
                            callback(res);
                        } else {
                            this.savingInProgress = false;
                        }
                        break;
                }
            },
                (error: any) => {
                    console.log(' Error while uploadDocuments :  ' + JSON.stringify(error));
                    this.savingInProgress = false;
                });

    }
    public saveDocument(_document) {
        if (this._commonAppService.isUndefined(this.tripObject._id)) {
            this._commonAppService.showErrorMessage('Alert', this._commonAppService.TripNotFoundMessage, function (alertRes) {
            });
            return;
        }
        if (_document._id) {
            this.saveEditedDocument(_document);
            return;
        }
        this.uploadDocument(_document, (res) => {
            _document.fileName = res.result.fileName;
            this._documentService.addDocument(this.currentUser, _document, false).subscribe((data: any) => {
                if (data.status === '1') {
                    _document.isUploaded = true;
                    _document._id = data.result._id;
                    // this.totalRecords = data.result.totalRecords;
                    // this.updateCount.emit({documents:this.totalRecords});
                    if (this.getNotUploadedCount() === 0) {
                        this.refresh(0);
                    }
                    this._commonAppService.showSuccessMessage('Alert', data.result.message, function (alertRes) { });
                } else {
                    this._commonAppService.showErrorMessage('Alert', data.result.message, function (alertRes) { });
                }
                this.savingInProgress = false;
            },
                (error: any) => {
                    console.log(' Error while uploadDocuments :  ' + JSON.stringify(error));
                    this.savingInProgress = false;
                });
        });
    }

    public saveEditedDocument(_document) {
        if (this._commonAppService.isUndefined(this.tripObject._id)) {
            this._commonAppService.showErrorMessage('Alert', this._commonAppService.TripNotFoundMessage, function (alertRes) {
            });
            return;
        }
        this.uploadDocument(_document, (res) => {
            _document.fileName = res.result.fileName;
            this._documentService.updateDocumentById(this.currentUser, _document).subscribe((data: any) => {
                if (data.status === '1') {
                    _document.isUploaded = true;
                    this._commonAppService.showSuccessMessage('Alert', data.result.message, function (alertRes) { });
                } else {
                    this._commonAppService.showErrorMessage('Alert', data.result.message, function (alertRes) { });
                }
                this.savingInProgress = false;
            },
                (error: any) => {
                    console.log(' Error while uploadDocuments :  ' + JSON.stringify(error));
                    this.savingInProgress = false;
                });
        });
    }

    public deleteDocument(document, index, isNew) {


        this._commonAppService.showConfirmDialog('This action will remove all un-uploaded file(s).', (confirmRes) => {
            if (confirmRes == true) {
                if (isNew) {
                    if (document._id === 0) {
                        this.newDocuments.splice(index, 1);
                    } else {
                        this.removeDocumentById(document, () => {
                            this.newDocuments.splice(index, 1);
                            this.refresh(0);
                            // this.totalRecords = this.totalRecords -1;
                            // if(this.totalRecords === 0 ){
                            //     this.refresh(0);
                            // }
                            // else if(this.totalRecords>0){
                            //     this.updateCount.emit({documents:this.totalRecords});
                            // }
                        });
                    }
                } else {
                    this.removeDocumentById(document, () => {
                        this.refresh(0);
                        // this.existingDocuments.splice(index, 1);

                        // this.totalRecords = this.totalRecords -1;
                        // if(this.totalRecords === 0 ){
                        //     this.refresh(0);
                        // }
                        // else if(this.totalRecords>0){
                        //     this.updateCount.emit({documents:this.totalRecords});
                        // }
                    });
                }
            }
        });
    }

    private removeDocumentById(document, callback) {
        this._documentService.removeDocumentById(this.currentUser, document._id)
            .subscribe((data: any) => {
                if (data.status == '1') {
                    this._commonAppService.showSuccessMessage('Alert', data.result.message, function (alertRes) {
                    });
                    callback();
                } else {
                    this._commonAppService.showErrorMessage('Alert', data.result.message, function (alertRes) {
                    });
                }
            },
            (error: any) => {
                console.log(' Error while getAllTrips :  ' + JSON.stringify(error));
            });
    }


    public fileOver(fileIsOver: boolean): void {
        this.fileIsOver = fileIsOver;
    }
    public onFileDrop(file): void {

        //this.file[0] = file;
        this.selectDocument(file);
    }
    public formatFileName(filename) {
        var fileindex = filename.lastIndexOf("-");
        if (fileindex > 0) {
            var rest = filename.substring(0, filename.lastIndexOf("-") + 1);
            var last = filename.substring(filename.lastIndexOf("."), filename.length);
            var filename = rest + last;
        }
        return filename;
    }
    public getNotUploadedCount() {
        var _count = 0;
        for (var i = 0; i < this.newDocuments.length; i++) {
            if (!this.newDocuments[i].isUploaded) {
                _count = _count + 1;
            }
        }
        return _count;
    }

    public getNotUploadedCountInExisting() {
        var _count = 0;
        for (var i = 0; i < this.existingDocuments.length; i++) {
            if (!this.existingDocuments[i].isUploaded) {
                _count = _count + 1;
            }
        }
        return _count;
    }

    public getValidFileExtension() {
        var data = {
            settingObject: GlobalVariable.SETTING_KEYS.ALLOWED_UPLOAD_TYPE
        }
        this._settingService.getSettingByKey(this.currentUser, data)
            .subscribe((data: any) => {
                
                if (data.status == '1') {
                    let prop = JSON.stringify(data.result.settings[0].settingValues[0].name);
                    this.extensionList = prop.split(',');
                    this.extensionList[0] = this.extensionList[0].substring(1);
                    this.extensionList[this.extensionList.length - 1] = this.extensionList[this.extensionList.length - 1].substring(0, this.extensionList[this.extensionList.length - 1].length - 1);
                } else { }
            },
            (error: any) => {
                console.log(' Error while gettingCruise :  ' + JSON.stringify(error));
            });
        // let FileSettings = this._settingService.getSettingByKey(this.currentUser , 'AllowedUploadTypes');
    }
}
