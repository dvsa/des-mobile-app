import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '@components/common/common-components.module';
import { DirectivesModule } from '@directives/directives.module';
import { InstructorRegistrationComponent } from './instructor-registration/instructor-registration';
import { TellMeQuestionCardComponent } from './tell-me-question-card/tell-me-question-card';
import { TellMeQuestionOutcomeComponent } from './tell-me-question-outcome/tell-me-question-outcome';
import { TellMeQuestionComponent } from './tell-me-question/tell-me-question';

@NgModule({
  declarations: [
    TellMeQuestionCardComponent,
    TellMeQuestionComponent,
    TellMeQuestionOutcomeComponent,
    InstructorRegistrationComponent,
  ],
  imports: [CommonModule, ComponentsModule, IonicModule, DirectivesModule, ReactiveFormsModule],
  exports: [
    TellMeQuestionCardComponent,
    TellMeQuestionComponent,
    TellMeQuestionOutcomeComponent,
    InstructorRegistrationComponent,
  ],
})
export class WaitingRoomToCarCatBComponentsModule {}
