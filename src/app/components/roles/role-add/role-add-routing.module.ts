/**
 * Role Add Rounting Module.
 */
import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router';
import {RoleAddComponent}    from './role-add.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'addRole',
                component: RoleAddComponent
            },
            {
                path: 'editRole/:roleId',
                component: RoleAddComponent
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class RoleAddRoutingModule {
}