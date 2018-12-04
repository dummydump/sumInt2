/**
 * User Add page modules
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { UserAddComponent } from './user-add.component';
import { UserAddRoutingModule } from './user-add-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material';
import {NgxMaskModule} from 'ngx-mask';
@NgModule({
    imports: [
        CommonModule,
        UserAddRoutingModule,
        FormsModule, 
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        NgxMaskModule.forRoot(),
    ],
    declarations: [
        UserAddComponent
    ]
})
export class UserAddModule {
}
