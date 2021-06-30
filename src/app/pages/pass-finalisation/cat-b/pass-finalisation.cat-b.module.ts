import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '@components/common/common-components.module';
import { TestFinalisationComponentsModule } from '@components/test-finalisation/test-finalisation-components.module';
import { PassFinalisationCatBPageRoutingModule }
  from '@pages/pass-finalisation/cat-b/pass-finalisation.cat-b-routing.module';
import { PassFinalisationCatBPage } from './pass-finalisation.cat-b.page';
import { PassFinalisationComponentsModule } from '../components/pass-finalisation-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    TestFinalisationComponentsModule,
    PassFinalisationComponentsModule,
    PassFinalisationCatBPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [PassFinalisationCatBPage],
})
export class PassFinalisationCatBPageModule {}
