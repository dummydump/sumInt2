import { numberOnly } from "./numberOnly";
import { NgModule } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
@NgModule({
    imports: [
        
     ],
    declarations: [
         numberOnly
    ],
    exports: [
        numberOnly
    ],
    providers:[
        CurrencyPipe
    ]

})
export class NumberOnlyModule {
}