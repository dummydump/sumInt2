/**
 * Cruise Lines page modules
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { ManageCruiseLinesComponent } from './cruiselines-add.component';
import { ManageCruiseLinesRoutingModule } from "./cruiselines-add-routing.module";
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material';

@NgModule({
    imports: [
        CommonModule,
        ManageCruiseLinesRoutingModule,
        FormsModule, 
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule
    ],
    declarations: [
        ManageCruiseLinesComponent
    ]
})
export class ManageCruiseLinesModule {
}
