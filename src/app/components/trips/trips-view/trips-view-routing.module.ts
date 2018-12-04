/**
 * Trips View Rounting Module.
 */
import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router';
import {TripsViewComponent}    from './trips-view.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: TripsViewComponent
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class TripsViewRoutingModule {
}