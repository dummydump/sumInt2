/**
 * Checks Received page modules
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { ChecksReceivedViewComponent } from './checks-received-view.component';
import { ChecksReceivedViewRoutingModule } from "./checks-received-view-routing.module";
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material';
import { NgxSpinnerModule } from 'ngx-spinner';

import { PaginationComponentModule } from './../../../custom/pagination/pagination-component.module';


@NgModule({
    imports: [
        CommonModule,
        ChecksReceivedViewRoutingModule,
        FormsModule, 
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        NgxSpinnerModule,
        PaginationComponentModule
    ],
    declarations: [
        ChecksReceivedViewComponent
    ]
})
export class ChecksReceivedViewModule {
}
