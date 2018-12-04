/**
 * Calendar page modules
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { CalendarComponent } from './calendar.component';
import { CalendarRoutingModule } from "./calendar-routing.module";
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule, MatDatepickerModule, MatNativeDateModule } from '@angular/material';

import { CalendarModule } from 'angular-calendar';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DemoUtilsModule } from '../demo-utils/module';
import { MyDatePickerModule } from 'mydatepicker';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LoadingModule } from 'ngx-loading';

import { CalendarPaginationComponentModule } from '../custom/calendar-pagination/calendar-pagination-component.module';

@NgModule({
    imports: [
        CommonModule,
        CalendarRoutingModule,
        FormsModule, 
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatNativeDateModule,
        CalendarPaginationComponentModule,
        MatSelectModule,
        NgxSpinnerModule,
        LoadingModule,
        MatInputModule,
		CalendarModule.forRoot(),
		NgbModalModule.forRoot(),
        MyDatePickerModule,
		DemoUtilsModule
    ],
    declarations: [
        CalendarComponent
    ]
})
export class CalendarModuleNew {
}
