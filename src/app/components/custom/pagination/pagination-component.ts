import { PortViewRoutingModule } from './../../admin/port-view/port-view-routing.module';

import { Component, Input, Output, OnInit, AfterViewInit, EventEmitter, SimpleChanges, SimpleChange, ChangeDetectorRef } from '@angular/core';
import { CommonAppService } from '../../../services/index';

@Component({
    providers: [CommonAppService],
    selector: 'app-pagination',
    styleUrls: ['./pagination-component.css'],
    templateUrl: './pagination-component.html'
})

export class PaginationComponent implements OnInit, AfterViewInit {

    public pageCount = 0;
    public limit = 10;
    public currentPageCount = 0;
    public pagerList = [];
    public pgList = {};
    public currentSearchKey = '';
    public currentSearchValue = '';
    public searchObject = {};
    @Input() currentPageCountNew;
    @Input() isSearching;
    @Input() paginationList;
    @Input() totalRecords;
    @Input() showLimit;

    @Output() currentPageCountEvent = new EventEmitter<any>();
    @Output() limitChangeEvent = new EventEmitter<any>();

    constructor(public _commonAppService: CommonAppService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.getPaginationList(0, 10);
        if(this.currentPageCountNew == 0) {
            this.currentPageCountChange(0,10);
        }

    }
    
    ngAfterViewInit() { }
    
    ngOnChanges(changes: SimpleChange) { 

        if(this.currentPageCountNew == 0){
            this.currentPageCount = 0;
            this.getPaginationList(0, 10); 
            this.cdr.detectChanges();
        }

        if (changes['isSearching']) {
            this.currentPageCount = 0;
            this.getPaginationList(0, this.limit);
        } else if (changes['paginationList']) {
            this.getPaginationList(0, this.limit);
        }
    }

    public setPageLimit(option) {
        this.limit = parseInt(option);
        this.limitChangeEvent.emit(this.limit);
        this.currentPageCount = 0;
        this.getPaginationList(0, this.limit);
    }

    public currentPageCountChange(pageCount, limit) {
        this.currentPageCountEvent.emit(pageCount);
        this.currentPageCount = pageCount;
    }

    public getPaginationList(pageCount, limit) {
        // this.currentPageCount = (this.isSearching && this.pgList['pages'] && this.pgList['pages'].length < 2) ? 0 : pageCount;

        let data = { "pageCount": this.currentPageCount, "limit": limit };

        data['search'] = this.searchObject;

        if (this.currentSearchKey != '' && this.currentSearchValue != '') {
            data['searchBy'] = this.currentSearchKey;
            data['searchValue'] = this.currentSearchValue;
        }

        if (this.paginationList.length > 0) {
            let _pList = this._commonAppService.getPagerList(this.totalRecords, this.limit, this.currentPageCount);
            this.pgList = (_pList) ? _pList : [];
        } else {
            this.totalRecords = 0;
            this.pagerList = [];
            this.pgList['pages'] = [];
        }
        
    }

}