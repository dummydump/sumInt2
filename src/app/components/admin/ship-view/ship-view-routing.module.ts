import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShipViewComponent } from './ship-view.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    {
        path: '',
        component:ShipViewComponent
    }
])],
  exports: [RouterModule]
})
export class ShipViewRoutingModule { }
