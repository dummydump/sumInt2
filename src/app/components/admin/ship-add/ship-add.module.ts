import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { ShipAddRoutingModule } from './ship-add-routing.module';
import { ShipAddComponent } from './ship-add.component';

@NgModule({
  imports: [
    CommonModule,
    ShipAddRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TypeaheadModule.forRoot(),
  ],
  declarations: [ShipAddComponent]
})
export class ShipAddModule { }
