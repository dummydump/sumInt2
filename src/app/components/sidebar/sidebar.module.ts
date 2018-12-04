/**
 * Sidebar Rounting Module.
 */
import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router';
import {SidebarComponent}    from './sidebar.component';


@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: SidebarComponent
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class SidebarModule {
}