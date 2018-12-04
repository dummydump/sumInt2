/**
 * Login Rounting Module.
 */
import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router';
import {TourOperatorsComponent}    from './tour-operators.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: TourOperatorsComponent
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class TourOperatorsRoutingModule {
}