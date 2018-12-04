/**
 * Bookings Tab page modules
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { NotesTabComponent } from './notes-tab.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material';
import { QuillModule } from 'ngx-quill'
//import { TinyEditorComponent } from '../../../custom/tiny-editor.component/tiny-editor.component';
import { TinyEditorModule } from '../../../custom/tiny-editor.component/tiny-editor.module';

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
        TinyEditorModule,
        QuillModule        
    ],
    declarations: [
        NotesTabComponent,
      //  TinyEditorComponent
    ],
    exports: [NotesTabComponent]
})
export class NotesViewModule {
}
