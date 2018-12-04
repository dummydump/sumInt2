import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewCruiseItinerariesComponent } from './view-cruise-itineraries.component';

const routes: Routes = [];

@NgModule({
  imports: [
    RouterModule.forChild([
        {
            path: '',
            component:ViewCruiseItinerariesComponent
        }
    ])
],
  exports: [RouterModule]
})
export class ViewCruiseItinerariesRoutingModule { }
