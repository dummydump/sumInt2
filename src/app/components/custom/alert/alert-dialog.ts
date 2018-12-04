import { Overlay } from 'ngx-modialog';
import { Modal } from 'ngx-modialog/plugins/bootstrap';
import { Component } from '@angular/core';

@Component({
    selector: 'alert-dialog',
    templateUrl: './alert-dialog.html'
})
export class AlertDialog {

    public title: string;
    public message: string;

    constructor(public modal: Modal) {

    }
}