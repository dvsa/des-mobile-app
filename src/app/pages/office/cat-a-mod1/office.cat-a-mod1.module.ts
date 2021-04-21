import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OfficeCatAMod1PageRoutingModule } from './office.cat-a-mod1-routing.module';

import { OfficeCatAMod1Page } from './office.cat-a-mod1.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OfficeCatAMod1PageRoutingModule,
  ],
  declarations: [OfficeCatAMod1Page],
})
export class OfficeCatAMod1PageModule {}
