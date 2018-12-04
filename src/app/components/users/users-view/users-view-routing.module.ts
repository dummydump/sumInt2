/**
 * Users View Rounting Module.
 */
import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router';
import {UsersViewComponent}    from './users-view.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: UsersViewComponent
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class UsersViewRoutingModule {
}