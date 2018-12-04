/**
 * Properties Rounting Module.
 */
import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router';
import {PropertiesComponent}    from './properties.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: PropertiesComponent
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class PropertiesRoutingModule {
}