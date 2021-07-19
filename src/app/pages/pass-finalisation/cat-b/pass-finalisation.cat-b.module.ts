import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '@components/common/common-components.module';
import { TestFinalisationComponentsModule } from '@components/test-finalisation/test-finalisation-components.module';
import { PassFinalisationCatBPageRoutingModule }
  from '@pages/pass-finalisation/cat-b/pass-finalisation.cat-b-routing.module';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { PassCertificateValidationProvider } from '@providers/pass-certificate-validation/pass-certificate-validation';
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
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    OutcomeBehaviourMapProvider,
    PassCertificateValidationProvider,
  ],
  declarations: [PassFinalisationCatBPage],
})
export class PassFinalisationCatBPageModule {}
