import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { PortAddRoutingModule } from './port-add-routing.module';
import { PortAddComponent } from './port-add.component';
import { QuillModule } from 'ngx-quill';
import { TinyEditorModule } from '../../custom/tiny-editor.component/tiny-editor.module';

@NgModule({
  imports: [
    CommonModule,
    PortAddRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TinyEditorModule
    
  ],
  declarations: [PortAddComponent]
})
export class PortAddModule { }
