import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OfficePage } from './office.page';
import { OfficePageRoutingModule } from './office-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OfficePageRoutingModule,
  ],
  declarations: [
    OfficePage,
  ]
})
export class OfficePageModule { }
