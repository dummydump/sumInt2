/**
 * Cruise Lines Rounting Module.
 */
import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router';
import {ManageCruiseLinesComponent}    from './cruiselines-add.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: ':id',
                component: ManageCruiseLinesComponent
            },
            {
                path: '',
                component: ManageCruiseLinesComponent
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ManageCruiseLinesRoutingModule {
}