/**
 * Login Rounting Module.
 */
import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router';
import {ChecksReceivedViewComponent}    from './checks-received-view.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: ChecksReceivedViewComponent
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ChecksReceivedViewRoutingModule {
}