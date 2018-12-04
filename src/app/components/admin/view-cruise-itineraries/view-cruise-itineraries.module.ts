import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';

import { ViewCruiseItinerariesRoutingModule } from './view-cruise-itineraries-routing.module';
import { ViewCruiseItinerariesComponent } from './view-cruise-itineraries.component';

@NgModule({
  imports: [
    CommonModule,
    ViewCruiseItinerariesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
  ],
  declarations: [ViewCruiseItinerariesComponent]
})
export class ViewCruiseItinerariesModule { }
