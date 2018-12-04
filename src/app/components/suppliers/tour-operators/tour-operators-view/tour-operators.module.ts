/**
 * Tour Operators page modules
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { TourOperatorsComponent } from './tour-operators.component';
import { TourOperatorsRoutingModule } from "./tour-operators-routing.module";
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
    imports: [
        CommonModule,
        TourOperatorsRoutingModule,
        FormsModule, 
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        NgxSpinnerModule
    ],
    declarations: [
        TourOperatorsComponent
    ]
})
export class TourOperatorsModule {
}
