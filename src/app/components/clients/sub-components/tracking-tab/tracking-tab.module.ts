/**
 * Bookings Tab page modules
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { TrackingTabComponent } from './tracking-tab.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxMaskModule } from 'ngx-mask';


@NgModule({
    imports: [
        CommonModule,
        FormsModule, 
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        NgxSpinnerModule,
        TypeaheadModule.forRoot(),
        NgxMaskModule.forRoot(),
        MatInputModule
    ],
    declarations: [
        TrackingTabComponent
    ],
    exports: [TrackingTabComponent]
})
export class TrackingViewModule {
}
