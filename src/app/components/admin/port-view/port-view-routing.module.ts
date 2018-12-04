import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PortViewComponent } from './port-view.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    {
        path: '',
        component:PortViewComponent
    }
])],
  exports: [RouterModule]
})
export class PortViewRoutingModule { }
