import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';

import { CruiseLinesViewRoutingModule } from './cruise-lines-view-routing.module';
import { CruiseLinesViewComponent } from './cruise-lines-view.component';

@NgModule({
  imports: [
    CommonModule,
    CruiseLinesViewRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule
  ],
  declarations: [CruiseLinesViewComponent]
})
export class CruiseLinesViewModule { }
