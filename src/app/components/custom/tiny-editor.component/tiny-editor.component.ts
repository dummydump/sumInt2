import {
    Component,
    AfterViewInit,
    EventEmitter,
    OnDestroy,
    Input,
    Output
} from '@angular/core';

import 'tinymce';
import 'tinymce/themes/modern';

import 'tinymce/plugins/table';
import 'tinymce/plugins/link';
import 'tinymce/plugins/textcolor';
import 'tinymce/plugins/code';
declare var tinymce: any;

@Component({
    selector: 'text-editor',
    templateUrl: './tiny-editor.component.html',
    styleUrls: ['./tiny-editor.component.css']
})
export class TinyEditorComponent implements AfterViewInit, OnDestroy {
    @Input() elementId: String;
    @Input() toolbar: String;
    @Output() onEditorContentChange:EventEmitter<any> = new EventEmitter();
    @Input() desiredInitialText: string;


    editor;

    ngAfterViewInit() {
        tinymce.init({
            selector: '#' + this.elementId,
            menubar: false,
            branding: false,
            plugins: ['link', 'table', 'textcolor', 'code'],
            skin_url: 'assets/skins/lightgray',
            toolbar : this.toolbar,
            setup: editor => {
                this.editor = editor;
                // editor.on('keyup', () => {
                //     const content = editor.getContent();
                //     this.onEditorContentChange.emit(content);
                // });
                editor.on('Change',  () =>{
                    const content = editor.getContent();
                    this.onEditorContentChange.emit(content);
                  });
            }
        });
    }

    setContent(_content){
        this.editor.setContent(_content);
    }

    ngOnChanges() {
        if (this.editor) {
          if (this.desiredInitialText && this.desiredInitialText.length > 0) {
            this.editor.setContent(this.desiredInitialText)
          } else {
            this.editor.setContent('');
          }
        }
      }
    
    ngOnDestroy() {
        tinymce.remove(this.editor);
    }
}