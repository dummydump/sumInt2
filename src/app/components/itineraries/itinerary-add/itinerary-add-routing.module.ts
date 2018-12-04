/**
 * Itinerary Add Rounting Module.
 */
import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router';
import {ItineraryAddComponent}    from './itinerary-add.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: ItineraryAddComponent
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ItineraryAddRoutingModule {
}