import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ComponentsModule } from '@components/common/common-components.module';
import { TestFinalisationComponentsModule } from '@components/test-finalisation/test-finalisation-components.module';
import { IonicModule } from '@ionic/angular';
import { DirectivesModule } from '@directives/directives.module';
import {
  FurtherDevelopmentComponent,
} from '@pages/pass-finalisation/cat-adi-part3/components/further-development/further-development.component';
import {
  ReasonGivenComponent,
} from '@pages/pass-finalisation/cat-adi-part3/components/reason-given/reason-given.component';
import { TestResultProvider } from '@providers/test-result/test-result';
import { PassFinalisationCatADIPart3Page } from './pass-finalisation.cat-adi-part3.page';
import {
  PassFinalisationCatADIPart3PageRoutingModule,
} from './pass-finalisation.cat-adi-part3-routing.module';

@NgModule({
  imports: [
    CommonModule,
    DirectivesModule,
    FormsModule,
    IonicModule,
    PassFinalisationCatADIPart3PageRoutingModule,
    ComponentsModule,
    TestFinalisationComponentsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    PassFinalisationCatADIPart3Page,
    FurtherDevelopmentComponent,
    ReasonGivenComponent,
  ],
  providers: [TestResultProvider],
})
export class PassFinalisationCatADIPart3PageModule {}
