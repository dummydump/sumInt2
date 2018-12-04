/**
 * Notes Tab Page Component.
 */
//  Importing necessary Classes
import {NgClass} from '@angular/common';
// tslint:disable-next-line:max-line-length
import { Component, ViewChild, NgModule, OnInit, Output, AfterViewInit, EventEmitter, OnDestroy, ElementRef, NgZone, Renderer, Directive, Inject, ViewContainerRef, OnChanges, SimpleChanges, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonAppService, TripService, UserService, NotesService } from '../../../../services/index';
import { GlobalVariable } from '../../../../services/static-variable';
import {BrowserModule, DomSanitizer} from '@angular/platform-browser';


// Creating Component
@Component({
    providers: [
        CommonAppService,
        TripService,
        UserService,
        NotesService
    ],
    selector: 'notes-tab',
    styleUrls: ['./notes-tab.component.css'],
    templateUrl: './notes-tab.component.html'
})

// Creating NotesTabComponent Class
export class NotesTabComponent implements OnInit, AfterViewInit,OnChanges {

    // Declaring required Variables
    public currentUser: any;
    public isEditorShow = false;
    public currentContent = '';
    public pageCount = 0;
    public limit = 10;
    public totalRecords = 0;
    public currentPageCount = 0;
    public pagerList = [];
    public notes = [];
    @Input('tripObject') tripObject;
    @Output() updateCount = new EventEmitter();
    @ViewChild('noteEditor') noteEditor: ElementRef;
    constructor(
        public _route: ActivatedRoute,
        public _router: Router,
        public _commonAppService: CommonAppService,
        public _tripService: TripService,
        public _userService: UserService,
        public _notesService: NotesService,
        public _viewContainerRef: ViewContainerRef,
        private sanitizer: DomSanitizer
    ) {
       
        // Authenticating the User,if not a legitimate user,redirecting
        // to LogIn Page
        this._commonAppService.getCurrentUserSession( (user) => {
            this.currentUser = user;
            if (this._commonAppService.isUndefined(this.currentUser)) {
                window.location.href = '/login';
            }
        });
    }

/**
 * @description
 * ngOnInit is called right after the directive's data-bound properties have been 
 * checked for the first time, and before any of its children have been checked.
 * It is invoked only once when the directive is instantiated.
 * @param void
 * @returns void
 */
    public ngOnInit() {
    }


/**
 * @description This is called when the component's view has been completely initialized.
 * When Component View is completely loaded,we will set the ViewMode to day or month for the corresponding month.
 * @param void
 * @returns void
 * @requires isUndefined(obj: any)
 */
    public ngAfterViewInit() {
    }
    ngOnChanges(changes: SimpleChanges) {
        if (changes.tripObject) {
            if (!this._commonAppService.isUndefined(this.tripObject) &&
            !this._commonAppService.isUndefined(this.tripObject._id)) {
                this.refreshNotes(this.pageCount, this.limit);
             }
         }
         
    }
    // public setNote(noteHtml){
    //     return  this.sanitizer.bypassSecurityTrustHtml(noteHtml);
    //  }
    public toolbarConfig = "bold italic underline strikethrough | alignleft aligncenter alignright " +
     " alignjustify alignnone  | styleselect formatselect | fontselect fontsizeselect | forecolor backcolor | link | code"

//Availiable Options for TinyMCE
    // bold
    // italic
    // underline
    // strikethrough
    // alignleft
    // aligncenter
    // alignright
    // alignjustify
    // alignnone
    // styleselect
    // formatselect
    // fontselect
    // fontsizeselect
    // cut
    // copy
    // paste
    // outdent
    // indent
    // blockquote
    // undo
    // redo
    // removeformat
    // subscript
    // superscript
    // visualaid
    // insert
    // hr
    // bullist
    // numlist
    // link
    // unlink
    // openlink
    // image
    // charmap
    // pastetext
    // print
    // preview
    // anchor
    // pagebreak
    // spellchecker
    // searchreplace
    // visualblocks
    // visualchars
    // code
    // help
    // fullscreen
    // insertdatetime
    // media
    // nonbreaking
    // save
    // cancel
    // table
    // tabledelete
    // tablecellprops
    // tablemergecells
    // tablesplitcells
    // tableinsertrowbefore
    // tableinsertrowafter
    // tabledeleterow
    // tablerowprops
    // tablecutrow
    // tablecopyrow
    // tablepasterowbefore
    // tablepasterowafter
    // tableinsertcolbefore
    // tableinsertcolafter
    // tabledeletecol
    // rotateleft
    // rotateright
    // flipv
    // fliph
    // editimage
    // imageoptions
    // fullpage
    // ltr
    // rtl
    // emoticons
    // template
    // forecolor
    // backcolor
    // restoredraft
    // insertfile
    // a11ycheck
    // toc
    // quickimage
    // quicktable
    // quicklink


    public editorOption = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            //['blockquote', 'code-block'],
        
           // [{ 'header': 1 }, { 'header': 2 }],               // custom button values
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
           // [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
           // [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
            //[{ 'direction': 'rtl' }],                         // text direction
        
            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
           // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        
            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            //[{ 'font': [] }],
           [{ align: ['','right', 'center','justify'] }],
           // [{ align: ''},{align: 'right'},{align: 'center'} ,{ align: 'justify' }],
        
           // ['clean'],                                         // remove formatting button
           ['link', 'image'],
          
           // ['link', 'image', 'video']                         // link and image, video
          ]
    } 
    public refreshNotes(pageCount, limit){
       if(this._commonAppService.isUndefined(this.tripObject._id)){
           return;
       }
        this.currentPageCount = pageCount;
        let data = {
            'pageCount': pageCount,
            'limit' : limit,
            tripId: this.tripObject._id,
        };
        this._commonAppService.spinner.show();
        this._notesService.getNotes(this.currentUser, data)
            .subscribe((res: any) => {
                if (res.status === '1') {
                    this.sanitizeHtml(res.result.notes);
                    this.totalRecords = res.result.totalRecords;
                    this.updateCount.emit({notes:this.totalRecords});
                   // let _pList = this._commonAppService.getPagerList(this.totalRecords, this.limit);
                  //  this.pagerList = (_pList) ? _pList : [];
                } else {
                    this.notes = [];
                    this.totalRecords = 0;
                    this.updateCount.emit({notes:this.totalRecords});
                    this.pagerList = [];
                }
            },
                (error: any) => {
                    console.log(' Error while getAllTrips :  ' + JSON.stringify(error));
                });
                 setTimeout( () => {
                    this._commonAppService.spinner.hide();
                }, 1000);
    }
    public sanitizeHtml(notes){
        for(var i = 0;i<notes.length;i++){
            notes[i].note =  this.sanitizer.bypassSecurityTrustHtml(notes[i].note);
        }
        this.notes = notes;
    }
    public EditorContentChange(event) {
        this.currentContent = event;
        }
    public saveNote(){
        if(this._commonAppService.isUndefined(this.tripObject._id)){
            this._commonAppService.showErrorMessage('Alert', this._commonAppService.TripNotFoundMessage, function (alertRes) {
            });
            return;
        }
        // Removing trailing WhiteSpaces and NewLine Characters
        // at the end of the Note
        let modifiedNoteContent = this.currentContent;
        modifiedNoteContent = modifiedNoteContent.split('<p>&nbsp;</p>').join('');
        var note= { 
            //  Assigning Modified Note Content
             'note': modifiedNoteContent,
             'noteDate': new Date(),
             'addedBy': this.currentUser.user.firstName + ' ' + this.currentUser.user.lastName,
             'tripId' : this.tripObject._id
            };
        this._commonAppService.spinner.show();
        this._notesService.addNote(this.currentUser, note,false)
        .subscribe((res: any) => {
            if (res.status === '1') {
                this.isEditorShow = false;
                this._commonAppService.showSuccessMessage('Alert', res.result.message, function(alertRes){ 
                });
                this.refreshNotes(this.pageCount, this.limit);
                this.currentContent = "";
            } else {
                this._commonAppService.showErrorMessage('Alert', res.result.message, function (alertRes) {
                });
            }
        },
            (error: any) => {
                console.log(' Error while getAllTrips :  ' + JSON.stringify(error));
            });
             setTimeout( () => {
                this._commonAppService.spinner.hide();
            }, 1000);
    }

}
