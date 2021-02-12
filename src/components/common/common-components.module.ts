import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DataRowComponent } from './data-row/data-row';
import { DataRowCustomComponent } from './data-row-custom/data-row-custom';
import { DisplayAddressComponent } from './display-address/display-address';
import { ErrorMessageComponent } from './error-message/error-message';

@NgModule({
  declarations: [
    DataRowComponent,
    DataRowCustomComponent,
    DisplayAddressComponent,
    ErrorMessageComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [
    DataRowComponent,
    DataRowCustomComponent,
    DisplayAddressComponent,
    ErrorMessageComponent,
  ],
})
export class ComponentsModule { }
