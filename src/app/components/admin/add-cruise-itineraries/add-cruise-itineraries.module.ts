import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxMaskModule } from 'ngx-mask';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { TinyEditorModule } from '../../custom/tiny-editor.component/tiny-editor.module';

import { AddCruiseItinerariesRoutingModule } from './add-cruise-itineraries-routing.module';
import { AddCruiseItinerariesComponent } from './add-cruise-itineraries.component';

@NgModule({
  imports: [
        CommonModule,
        AddCruiseItinerariesRoutingModule,
        FormsModule, 
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        NgxSpinnerModule,
        TypeaheadModule.forRoot(),
        NgxMaskModule.forRoot(),
        MatInputModule,
        TypeaheadModule.forRoot(),
        TinyEditorModule

  ],
  declarations: [AddCruiseItinerariesComponent]
})
export class AddCruiseItinerariesModule { }
