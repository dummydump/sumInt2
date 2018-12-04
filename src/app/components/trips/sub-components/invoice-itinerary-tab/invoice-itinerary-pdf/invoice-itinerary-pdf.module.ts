/**
 * PDF page modules
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InvoiceItineraryPDFComponent } from './invoice-itinerary-pdf.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material';
import { SafePipe } from "../../../../custom/pipes/pipe";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule
    ],
    declarations: [
        InvoiceItineraryPDFComponent,
        SafePipe
    ],
    exports: [InvoiceItineraryPDFComponent]
})
export class InvoiceItineraryPDFModule {
}
