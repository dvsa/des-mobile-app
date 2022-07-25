import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';
import {
  FurtherDevelopmentComponent,
} from '@pages/pass-finalisation/cat-adi-part3/components/further-development/further-development.component';
import {
  ReasonGivenComponent,
} from '@pages/pass-finalisation/cat-adi-part3/components/reason-given/reason-given.component';
import { DirectivesModule } from '@directives/directives.module';

@NgModule({
  declarations: [
    FurtherDevelopmentComponent,
    ReasonGivenComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
    ComponentsModule,
    ReactiveFormsModule,
    DirectivesModule,
  ],
  exports: [
    FurtherDevelopmentComponent,
    ReasonGivenComponent,
  ],
})
export class PassFinalisationCatADI3ComponentsModule {}
