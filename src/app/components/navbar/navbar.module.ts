/**
 * Navbar page modules
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './navbar.component';

@NgModule({
	imports: [
		RouterModule,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
	],
	declarations: [
		NavbarComponent],
	exports: [
		NavbarComponent
	]
})
export class NavbarModule { }
