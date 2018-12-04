/**
 * Alert dialog page modules
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { AlertDialog } from './alert-dialog';
import { MatButtonModule } from '@angular/material';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxMaskModule } from 'ngx-mask';
import { FileDropModule } from 'angular2-file-drop';

@NgModule({
    imports: [
        CommonModule,
        FormsModule, 
        ReactiveFormsModule,
        NgxMaskModule.forRoot(),
        FileDropModule
    ],
    declarations: [
        AlertDialog
    ],
    exports: [AlertDialog]
})
export class AlertDialogModule {
}
