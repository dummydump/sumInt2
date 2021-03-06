/**
 * Bookings Tab page modules
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { BookingsInfoTabComponent } from './bookings-info-tab.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { NumberOnlyModule } from './../../../../directives/numberOnly.module';
@NgModule({
    imports: [
        CommonModule,
        FormsModule, 
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        TypeaheadModule.forRoot(),
        NumberOnlyModule
    ],
    declarations: [
        BookingsInfoTabComponent
        
    ],
    exports: [BookingsInfoTabComponent]
})
export class BookingsInfoViewModule {
}
