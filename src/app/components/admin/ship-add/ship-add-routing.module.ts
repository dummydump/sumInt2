import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShipAddComponent } from './ship-add.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    {
        path: 'addship',
        component: ShipAddComponent
    },
    {
      path: 'editship/:shipId',
      component: ShipAddComponent
  }
])],
  exports: [RouterModule]
})
export class ShipAddRoutingModule { }
