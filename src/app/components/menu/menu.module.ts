/**
 * Menu page modules
 */
import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';
import { CommonModule } from '@angular/common';  
import { MenuComponent } from './menu.component';
import { MatSidenavModule } from '@angular/material/sidenav';

@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		MatSidenavModule
	],
	declarations: [
		MenuComponent],
	exports: [
		MenuComponent
	]
})
export class MenuModule { }
