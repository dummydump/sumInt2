/**
 * Client Add page modules
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { ClientAddComponent } from './client-add.component';
// import { TrackingTabComponent } from '../sub-components/tracking-tab/tracking-tab.component';
import { TrackingViewModule } from '../sub-components/tracking-tab/tracking-tab.module';
// import { TripsTabComponent } from '../sub-components/trips-tab/trips-tab.component';
import { TripsViewModule } from '../sub-components/trips-tab/trips-tab.module';
// import { CommunicationsTabComponent } from '../sub-components/communications-tab/communications-tab.component';
import { CommunicationsViewModule } from '../sub-components/communications-tab/communications-tab.module';
import { ConfirmDialogModule } from '../../custom/confirm/confirm-dialog.module';
import { ClientAddRoutingModule } from "./client-add-routing.module";
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material';
import { TagInputModule } from 'ngx-chips';
import { UserService } from '../../../services/index';
import { Ng2CompleterModule } from 'ng2-completer';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { NgxSpinnerModule } from 'ngx-spinner';
import {NgxMaskModule} from 'ngx-mask';
TagInputModule.withDefaults({
    tagInput: {
        secondaryPlaceholder : "Enter tag & press enter",
        placeholder : "Enter tag & press enter"
    }
});

@NgModule({
    imports: [
        CommonModule,
        ClientAddRoutingModule,
        FormsModule, 
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        TagInputModule,
        Ng2CompleterModule,
        NgxSpinnerModule,
        TypeaheadModule.forRoot(),
        CommunicationsViewModule,
        ConfirmDialogModule,
        TrackingViewModule,
        TripsViewModule,
        NgxMaskModule.forRoot(),
    ],
    declarations: [
        ClientAddComponent
    ],
    providers: [UserService],
})
export class ClientAddModule {
}
