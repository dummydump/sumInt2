/**
 * Trips View page modules
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { TripsViewComponent } from './trips-view.component';
import { TripsViewRoutingModule } from "./trips-view-routing.module";
import { ConfirmDialogModule } from '../../custom/confirm/confirm-dialog.module';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material';
import { NgxSpinnerModule } from 'ngx-spinner';

import { PaginationComponentModule } from './../../custom/pagination/pagination-component.module';

@NgModule({
    imports: [
        CommonModule,
        TripsViewRoutingModule,
        ConfirmDialogModule,
        FormsModule, 
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        PaginationComponentModule,
        MatSelectModule,
        MatInputModule,
        NgxSpinnerModule
    ],
    declarations: [
        TripsViewComponent
    ]
})
export class TripsViewModule {
}
