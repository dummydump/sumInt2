/**
 * Cruise Lines Rounting Module.
 */
import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router';
import {CruiseLinesViewComponent}    from './cruiselines-view.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: CruiseLinesViewComponent
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class CruiseLinesViewRoutingModule {
}