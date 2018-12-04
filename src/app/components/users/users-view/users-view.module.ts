/**
 * Users View page modules
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { UsersViewComponent } from './users-view.component';
import { UsersViewRoutingModule } from './users-view-routing.module';
import { ConfirmDialogModule } from '../../custom/confirm/confirm-dialog.module';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material';
import {NgxMaskModule} from 'ngx-mask';

import { PaginationComponentModule } from './../../custom/pagination/pagination-component.module';

@NgModule({
    imports: [
        CommonModule,
        UsersViewRoutingModule,
        ConfirmDialogModule,
        FormsModule, 
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        PaginationComponentModule,
        NgxSpinnerModule,
        NgxMaskModule.forRoot(),
    ],
    declarations: [
        UsersViewComponent
    ]
})
export class UsersViewModule {
}
