import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ComponentsModule } from '@components/common/common-components.module';
import { DirectivesModule } from '@directives/directives.module';
import { IonCol, IonInput, IonRow, IonSelect, IonSelectOption, IonText } from '@ionic/angular';
import { MaskitoDirective } from '@maskito/angular';
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
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
    ReactiveFormsModule,
    MaskitoDirective,
    IonSelectOption,
    IonSelect,
    IonCol,
    IonRow,
    IonText,
    IonInput,
  ],
  exports: [
    TellMeQuestionCardComponent,
    TellMeQuestionComponent,
    TellMeQuestionOutcomeComponent,
    InstructorRegistrationComponent,
  ],
})
export class WaitingRoomToCarCatBComponentsModule {}
