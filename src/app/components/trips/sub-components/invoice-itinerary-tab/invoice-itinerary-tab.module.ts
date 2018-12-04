/**
 * Bookings Tab page modules
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InvoiceItineraryTabComponent } from './invoice-itinerary-tab.component';
import { InvoiceItinerarySummaryModule } from './invoice-itinerary-summary/invoice-itinerary-summary.module';
import { InvoiceBookingSummaryModule } from './invoice-booking-summary/invoice-booking-summary.module';
import { InvoiceItineraryPDFModule } from './invoice-itinerary-pdf/invoice-itinerary-pdf.module';
import { InvoiceBookingPDFModule } from './invoice-booking-pdf/invoice-booking-pdf.module';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        InvoiceItinerarySummaryModule,
        InvoiceBookingSummaryModule,
        InvoiceBookingPDFModule,
        InvoiceItineraryPDFModule
    ],
    declarations: [
        InvoiceItineraryTabComponent
    ],
    exports: [InvoiceItineraryTabComponent]
})
export class InvoiceItineraryViewModule {
}
