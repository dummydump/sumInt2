/**
 * manage-property Rounting Module.
 */
import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router';
import {ManagePropertyComponent}    from './manage-property.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: ManagePropertyComponent
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ManagePropertyRoutingModule {
}