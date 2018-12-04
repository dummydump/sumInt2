import { Overlay } from 'ngx-modialog';
import { Modal } from 'ngx-modialog/plugins/bootstrap';
import { Component } from '@angular/core';

@Component({
    selector: 'confirm-dialog',
    templateUrl: './confirm-dialog.html'
})
export class ConfirmDialog {

    public title: string;
    public message: string;

    constructor(public modal: Modal) {

    }
}