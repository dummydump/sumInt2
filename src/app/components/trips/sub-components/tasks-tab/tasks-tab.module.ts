/**
 * Bookings Tab page modules
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { TasksTabComponent } from './tasks-tab.component';
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
        FormsModule, 
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        NgxSpinnerModule,
        TypeaheadModule.forRoot()
    ],
    declarations: [
        TasksTabComponent
    ],
    exports: [TasksTabComponent]
})
export class TasksViewModule {
}
