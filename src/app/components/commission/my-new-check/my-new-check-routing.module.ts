/**
 * My new check Rounting Module.
 */
import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router';
import {MyNewCheckComponent}    from './my-new-check.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: MyNewCheckComponent
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class MyNewCheckRoutingModule {
}