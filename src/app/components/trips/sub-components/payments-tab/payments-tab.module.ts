
/**
 * Bookings Tab page modules
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { PaymentsTabComponent } from './payments-tab.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material';
import { NumberOnlyModule } from './../../../../directives/numberOnly.module';
import { LoadingModule } from 'ngx-loading';
import { NgxSpinnerModule } from 'ngx-spinner';

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
        LoadingModule,
        NumberOnlyModule,
        NgxSpinnerModule
    ],
    declarations: [
        PaymentsTabComponent,

    ],
    exports: [PaymentsTabComponent]
})
export class PaymentsViewModule {
}
