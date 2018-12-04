/**
 * Trip Add Rounting Module.
 */
import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router';
import {TripAddComponent}    from './trip-add.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'addTrip',
                component: TripAddComponent
            },
            {
                path: 'addTrip/:clientId',
                component: TripAddComponent
            },
            {
                path: 'editTrip/:tripId',
                component: TripAddComponent
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class TripAddRoutingModule {
}