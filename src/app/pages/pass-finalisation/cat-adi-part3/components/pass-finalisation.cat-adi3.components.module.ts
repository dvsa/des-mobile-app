import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { IonCol, IonRow } from '@ionic/angular';
import { FurtherDevelopmentComponent } from '@pages/pass-finalisation/cat-adi-part3/components/further-development/further-development.component';
import { ReasonGivenComponent } from '@pages/pass-finalisation/cat-adi-part3/components/reason-given/reason-given.component';
import { TestStartEndTimesComponent } from '@pages/pass-finalisation/cat-adi-part3/components/test-start-end-times/test-start-end-times';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonCol,
    IonRow,
    FurtherDevelopmentComponent,
    ReasonGivenComponent,
    TestStartEndTimesComponent,
  ],
  exports: [FurtherDevelopmentComponent, ReasonGivenComponent, TestStartEndTimesComponent],
})
export class PassFinalisationCatADI3 {}
