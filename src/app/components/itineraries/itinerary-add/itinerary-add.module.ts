/**
 * User Add page modules
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { ItineraryAddComponent } from './itinerary-add.component';
import { ItineraryAddRoutingModule } from "./itinerary-add-routing.module";
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material';

@NgModule({
    imports: [
        CommonModule,
        ItineraryAddRoutingModule,
        FormsModule, 
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule
    ],
    declarations: [
        ItineraryAddComponent
    ]
})
export class ItineraryAddModule {
}
