import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DataRowComponent } from './data-row/data-row';
import { DataRowCustomComponent } from './data-row-custom/data-row-custom';
import { DisplayAddressComponent } from './display-address/display-address';

@NgModule({
  declarations: [
    DataRowComponent,
    DataRowCustomComponent,
    DisplayAddressComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [
    DataRowComponent,
    DataRowCustomComponent,
    DisplayAddressComponent,
  ],
})
export class ComponentsModule { }
