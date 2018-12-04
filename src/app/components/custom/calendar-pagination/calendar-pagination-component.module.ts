/**
 * Pagination Component Module
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms'; 
import { CalendarPaginationComponent } from './calendar-pagination-component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule, 
        ReactiveFormsModule
    ],
    declarations: [CalendarPaginationComponent],
    exports: [CalendarPaginationComponent]
})
export class CalendarPaginationComponentModule { } 