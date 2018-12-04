import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CruiseLinesAddRoutingModule } from './cruise-lines-add-routing.module';
import { CruiseLinesAddComponent } from './cruise-lines-add.component';

@NgModule({
  imports: [
    CommonModule,
    CruiseLinesAddRoutingModule
  ],
  declarations: [CruiseLinesAddComponent]
})
export class CruiseLinesAddModule { }
