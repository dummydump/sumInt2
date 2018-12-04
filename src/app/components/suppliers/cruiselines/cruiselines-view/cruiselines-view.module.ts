/**
 * Cruise Lines page modules
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { CruiseLinesViewComponent } from './cruiselines-view.component';
import { CruiseLinesViewRoutingModule } from "./cruiselines-view-routing.module";
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material';
import { LoadingModule } from 'ngx-loading';
import { NgxSpinnerModule } from 'ngx-spinner';

import { PaginationComponentModule } from './../../../custom/pagination/pagination-component.module';

@NgModule({
    imports: [
        CommonModule,
        CruiseLinesViewRoutingModule,
        FormsModule, 
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        LoadingModule,
        NgxSpinnerModule,
        PaginationComponentModule
    ],
    declarations: [
        CruiseLinesViewComponent
    ]
})
export class CruiseLinesViewModule {
}
