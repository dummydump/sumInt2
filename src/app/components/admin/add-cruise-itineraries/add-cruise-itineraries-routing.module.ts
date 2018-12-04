import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddCruiseItinerariesComponent } from './add-cruise-itineraries.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    {
        path: 'addcrusieitineraries',
        component:AddCruiseItinerariesComponent
    },
    {
      path: 'editcrusieitineraries/:cruiseItinerariesId',
      component: AddCruiseItinerariesComponent
   }
])],
  exports: [RouterModule]
})
export class AddCruiseItinerariesRoutingModule { }
