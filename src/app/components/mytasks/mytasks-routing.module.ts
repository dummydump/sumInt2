/**
 * My Tasks Rounting Module.
 */
import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router';
import {MyTasksComponent}    from './mytasks.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: MyTasksComponent
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class MyTasksRoutingModule {
}