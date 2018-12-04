/**
 * User Add Rounting Module.
 */
import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router';
import {UserAddComponent}    from './user-add.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'addUser',
                component: UserAddComponent
            },
            {
                path: 'editUser/:userId',
                component: UserAddComponent
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class UserAddRoutingModule {
}