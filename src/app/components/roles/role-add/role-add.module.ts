/**
 * User Add page modules
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { RoleAddComponent } from './role-add.component';
import { RoleAddRoutingModule } from "./role-add-routing.module";
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material';

@NgModule({
    imports: [
        CommonModule,
        RoleAddRoutingModule,
        FormsModule, 
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule
    ],
    declarations: [
        RoleAddComponent
    ]
})
export class RoleAddModule {
}
