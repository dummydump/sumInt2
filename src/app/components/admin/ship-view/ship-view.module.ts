import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';

import { ShipViewRoutingModule } from './ship-view-routing.module';
import { ShipViewComponent } from './ship-view.component';

@NgModule({
  imports: [
    CommonModule,
    ShipViewRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule
  ],
  declarations: [ShipViewComponent]
})
export class ShipViewModule { }
