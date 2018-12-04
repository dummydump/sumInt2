/**
 * Roles View page modules
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { RolesViewComponent } from './roles-view.component';
import { RolesViewRoutingModule } from "./roles-view-routing.module";
import { ConfirmDialogModule } from '../../custom/confirm/confirm-dialog.module';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material';

@NgModule({
    imports: [
        CommonModule,
        RolesViewRoutingModule,
        FormsModule, 
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        ConfirmDialogModule,
        MatSelectModule,
        MatInputModule
    ],
    declarations: [
        RolesViewComponent
    ]
})
export class RolesViewModule {
}
