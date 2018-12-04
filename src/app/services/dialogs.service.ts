import { Observable } from 'rxjs/Rx';
import { ConfirmDialog } from '../components/custom/confirm/confirm-dialog';
import { AlertDialog } from '../components/custom/alert/alert-dialog';
import { Overlay } from 'ngx-modialog';
import { Modal } from 'ngx-modialog/plugins/bootstrap';
import { Injectable } from '@angular/core';

@Injectable()
export class DialogsService {

    constructor(public modal: Modal) { }

    public alert(title: string, message: string) {

        const dialogRef = this.modal.alert()
            .size('lg')
            .showClose(false)
            .okBtn('OK')
            .title(title)
            .body('<h4>'+ message +'</h4>')
            .open();

        return dialogRef.result.then( result => {
            return result;
        });
    }

    public confirm(title: string, message: string) {

        const dialogRef = this.modal.confirm()
            .size('lg')
            .showClose(true)
            .cancelBtn('NO')
            .okBtn('YES')
            .title(title)
            .body('<h4>'+ message +'</h4>')
            .open();

        // return dialogRef.result.catch( result => {
        //     alert(`1The result is: ${result}`)
        return dialogRef.result.then( result => {
            return result;
        });
        // });
        // return true;
    }
}
