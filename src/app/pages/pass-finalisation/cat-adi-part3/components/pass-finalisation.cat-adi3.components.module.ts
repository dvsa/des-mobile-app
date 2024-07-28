import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';
import { DirectivesModule } from '@directives/directives.module';
import { IonicModule } from '@ionic/angular';
import { FurtherDevelopmentComponent } from '@pages/pass-finalisation/cat-adi-part3/components/further-development/further-development.component';
import { ReasonGivenComponent } from '@pages/pass-finalisation/cat-adi-part3/components/reason-given/reason-given.component';
import { TestStartEndTimesComponent } from '@pages/pass-finalisation/cat-adi-part3/components/test-start-end-times/test-start-end-times';

@NgModule({
  declarations: [FurtherDevelopmentComponent, ReasonGivenComponent, TestStartEndTimesComponent],
  imports: [IonicModule, CommonModule, ComponentsModule, ReactiveFormsModule, DirectivesModule],
  exports: [FurtherDevelopmentComponent, ReasonGivenComponent, TestStartEndTimesComponent],
})
export class PassFinalisationCatADI3ComponentsModule {}
