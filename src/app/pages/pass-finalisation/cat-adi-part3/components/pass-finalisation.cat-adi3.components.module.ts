import { CdkTrapFocus } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';
import { DirectivesModule } from '@directives/directives.module';
import { IonicModule } from '@ionic/angular';
import { EffectsModule } from '@ngrx/effects';
import { ChangeStartEndTimeModal } from '@pages/pass-finalisation/cat-adi-part3/components/change-start-end-time-modal/change-start-end-time-modal';
import { ChangeStartEndTimeModalAnalyticsEffects } from '@pages/pass-finalisation/cat-adi-part3/components/change-start-end-time-modal/change-start-end-time-modal.analytics.effects';
import { FurtherDevelopmentComponent } from '@pages/pass-finalisation/cat-adi-part3/components/further-development/further-development.component';
import { ReasonGivenComponent } from '@pages/pass-finalisation/cat-adi-part3/components/reason-given/reason-given.component';
import { TestStartEndTimesComponent } from '@pages/pass-finalisation/cat-adi-part3/components/test-start-end-times/test-start-end-times';
import { TestStartEndTimesAnalyticsEffects } from '@pages/pass-finalisation/cat-adi-part3/components/test-start-end-times/test-start-end-times.analytics.effects';

@NgModule({
  declarations: [
    FurtherDevelopmentComponent,
    ReasonGivenComponent,
    TestStartEndTimesComponent,
    ChangeStartEndTimeModal,
  ],
  imports: [
    EffectsModule.forFeature([TestStartEndTimesAnalyticsEffects]),
    EffectsModule.forFeature([ChangeStartEndTimeModalAnalyticsEffects]),
    IonicModule,
    CommonModule,
    ComponentsModule,
    ReactiveFormsModule,
    DirectivesModule,
    CdkTrapFocus,
  ],
  exports: [FurtherDevelopmentComponent, ReasonGivenComponent, TestStartEndTimesComponent],
})
export class PassFinalisationCatADI3ComponentsModule {}
