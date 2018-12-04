
/**
 * Trip Add page modules
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { TripAddComponent } from './trip-add.component';
import { TripAddRoutingModule } from "./trip-add-routing.module";
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material';

import { BookingsViewModule } from '../sub-components/bookings-tab/bookings-tab.module';
import { BookingsInfoViewModule } from '../sub-components/bookings-info-tab/bookings-info-tab.module';
import { ReceiptsViewModule } from '../sub-components/receipts-tab/receipts-tab.module';
import { PaymentsViewModule } from '../sub-components/payments-tab/payments-tab.module';
import { DetailsViewModule } from '../sub-components/details-tab/details-tab.module';
import { FlightActivityViewModule } from '../sub-components/flights-activity-tab/flights-activity-tab.module';
import { InvoiceItineraryViewModule } from '../sub-components/invoice-itinerary-tab/invoice-itinerary-tab.module';
import { InvoiceItinerarySummaryModule } from '../sub-components/invoice-itinerary-tab/invoice-itinerary-summary/invoice-itinerary-summary.module';
import { DocumentsViewModule } from '../sub-components/documents-tab/documents-tab.module';
import { NotesViewModule } from '../sub-components/notes-tab/notes-tab.module';
import { TasksViewModule } from '../sub-components/tasks-tab/tasks-tab.module';
import { TimelineViewModule } from '../sub-components/timeline-tab/timeline-tab.module';
import { ConfirmDialogModule } from '../../custom/confirm/confirm-dialog.module';


import { Ng2CompleterModule } from 'ng2-completer';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxMaskModule } from 'ngx-mask';
import { BookingService } from '../../../services/index';

@NgModule({
    imports: [
        CommonModule,
        TripAddRoutingModule,
        FormsModule, 
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        Ng2CompleterModule,
        NgxSpinnerModule,
        TypeaheadModule.forRoot(),
        NgxMaskModule.forRoot(),
        BookingsViewModule,
        BookingsInfoViewModule,
        ReceiptsViewModule,
        PaymentsViewModule,
        DetailsViewModule,
        FlightActivityViewModule,
        InvoiceItineraryViewModule,
        InvoiceItinerarySummaryModule,
        NotesViewModule,
        TasksViewModule,
        TimelineViewModule,
        DocumentsViewModule,
        ConfirmDialogModule
    ],
    declarations: [
        TripAddComponent
    ],
    providers: [
        BookingService
      ],
})
export class TripAddModule {
}
