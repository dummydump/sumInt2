import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';

import { PortViewRoutingModule } from './port-view-routing.module';
import { PortViewComponent } from './port-view.component';

@NgModule({
  imports: [
    CommonModule,
    PortViewRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule
  ],
  declarations: [PortViewComponent]
})
export class PortViewModule { }
