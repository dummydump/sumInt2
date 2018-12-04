/**
 * Bookings Tab page modules
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { FlightsActivityTabComponent } from './flights-activity-tab.component';
import { ConfirmDialogModule } from '../../../custom/confirm/confirm-dialog.module';
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
        FormsModule, 
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        ConfirmDialogModule,
        MatInputModule, 
        NgxSpinnerModule,
        PaginationComponentModule
    ],
    declarations: [
        FlightsActivityTabComponent
    ],
    exports: [FlightsActivityTabComponent]
})
export class FlightActivityViewModule {
}
