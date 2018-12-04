/**
 * Documents Tab page modules
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { DocumentsTabComponent } from './documents-tab.component';
import { ConfirmDialogModule } from '../../../custom/confirm/confirm-dialog.module';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material';
import { FileDropModule } from 'angular2-file-drop';
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
        ConfirmDialogModule,
        FileDropModule,
        NgxSpinnerModule
    ],
    declarations: [
        DocumentsTabComponent
    ],
    exports: [DocumentsTabComponent]
})
export class DocumentsViewModule {
}
