import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PortAddComponent } from './port-add.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    {
        path: 'addport',
        component: PortAddComponent
    },
    {
      path: 'editport/:portId',
      component: PortAddComponent
  }
])],
  exports: [RouterModule]
})
export class PortAddRoutingModule { }
