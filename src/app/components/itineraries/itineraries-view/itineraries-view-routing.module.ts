/**
 * Itineraries View Rounting Module.
 */
import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router';
import {ItinerariesViewComponent}    from './itineraries-view.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: ItinerariesViewComponent
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ItinerariesViewRoutingModule {
}