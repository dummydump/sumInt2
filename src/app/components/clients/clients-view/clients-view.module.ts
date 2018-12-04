/**
 * Clients View page modules
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { ClientsViewComponent } from './clients-view.component';
import { CommunicationsViewModule } from '../sub-components/communications-tab/communications-tab.module';
import { ConfirmDialogModule } from '../../custom/confirm/confirm-dialog.module';
import { ClientsViewRoutingModule } from "./clients-view-routing.module";
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxMaskModule } from 'ngx-mask';
import { FileDropModule } from 'angular2-file-drop';
import { PaginationComponentModule } from './../../custom/pagination/pagination-component.module';

@NgModule({
    imports: [
        CommonModule,
        ClientsViewRoutingModule,
        FormsModule, 
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        PaginationComponentModule,
        MatSelectModule,
        MatInputModule,
        NgxSpinnerModule,
        NgxMaskModule.forRoot(),
        CommunicationsViewModule,
        ConfirmDialogModule,
        FileDropModule
    ],
    declarations: [
        ClientsViewComponent
    ]
})
export class ClientsViewModule {
}
