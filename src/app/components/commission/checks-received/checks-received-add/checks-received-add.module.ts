/**
 * Checks Received add page modules
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { ChecksReceivedAddComponent } from './checks-received-add.component';
import { ChecksReceivedAddRoutingModule } from "./checks-received-add-routing.module";
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { NgxSpinnerModule } from 'ngx-spinner';

import { PaginationComponentModule } from './../../../custom/pagination/pagination-component.module';


@NgModule({
    imports: [
        CommonModule,
        ChecksReceivedAddRoutingModule,
        FormsModule, 
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        TypeaheadModule.forRoot(),
        NgxSpinnerModule,
        PaginationComponentModule
    ],
    declarations: [
        ChecksReceivedAddComponent
    ]
})
export class ChecksReceivedAddModule {
}
