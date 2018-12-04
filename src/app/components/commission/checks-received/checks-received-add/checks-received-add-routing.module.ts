/**
 * Login Rounting Module.
 */
import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router';
import {ChecksReceivedAddComponent}    from './checks-received-add.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'addChecksReceived',
                component: ChecksReceivedAddComponent
            },
            {
                path: 'editChecksReceived/:id',
                component: ChecksReceivedAddComponent
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ChecksReceivedAddRoutingModule {
}