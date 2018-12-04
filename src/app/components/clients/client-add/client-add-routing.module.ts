/**
 * Client Add Rounting Module.
 */
import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router';
import {ClientAddComponent}    from './client-add.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'addClient',
                component: ClientAddComponent
            },
            {
                path: 'editClient/:clientId',
                component: ClientAddComponent
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ClientAddRoutingModule {
}