/**
 * Clients View Rounting Module.
 */
import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router';
import {ClientsViewComponent}    from './clients-view.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: ClientsViewComponent
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ClientsViewRoutingModule {
}