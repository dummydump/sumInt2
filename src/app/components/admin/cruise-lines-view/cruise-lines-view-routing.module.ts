import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CruiseLinesViewComponent } from './cruise-lines-view.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    {
        path: '',
        component:CruiseLinesViewComponent
    }
])],
  exports: [RouterModule]
})
export class CruiseLinesViewRoutingModule { }
