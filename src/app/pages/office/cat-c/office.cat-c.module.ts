import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { OfficeCatCPageRoutingModule } from './office.cat-c-routing.module';
import { OfficeCatCPage } from './office.cat-c.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OfficeCatCPageRoutingModule,
  ],
  declarations: [OfficeCatCPage],
})
export class OfficeCatCPageModule {}
