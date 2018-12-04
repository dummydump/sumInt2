/**
 * Roles View Rounting Module.
 */
import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router';
import {RolesViewComponent}    from './roles-view.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: RolesViewComponent
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class RolesViewRoutingModule {
}