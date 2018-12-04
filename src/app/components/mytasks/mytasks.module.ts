/**
 * My tasks page modules
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { MyTasksComponent } from './mytasks.component';
import { MyTasksRoutingModule } from "./mytasks-routing.module";
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
    imports: [
        CommonModule,
        MyTasksRoutingModule,
        FormsModule, 
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        NgxSpinnerModule,
        MatSelectModule,
        MatInputModule,
        TypeaheadModule.forRoot()
    ],
    declarations: [
        MyTasksComponent
    ]
})
export class MyTasksModule {
}
