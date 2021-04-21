import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BackToOfficeCatAMod1PageRoutingModule } from './back-to-office.cat-a-mod1-routing.module';

import { BackToOfficeCatAMod1Page } from './back-to-office.cat-a-mod1.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BackToOfficeCatAMod1PageRoutingModule,
  ],
  declarations: [BackToOfficeCatAMod1Page],
})
export class BackToOfficeCatAMod1PageModule {}
