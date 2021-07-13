import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { D255Component } from '@components/test-finalisation/d255/d255';
import { DebriefWitnessedComponent } from '@components/test-finalisation/debrief-witnessed/debrief-witnessed';
import { FinalisationHeaderComponent } from '@components/test-finalisation/finalisation-header/finalisation-header';
import { LanguagePreferencesComponent } from '@components/test-finalisation/language-preference/language-preference';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    LanguagePreferencesComponent,
    D255Component,
    DebriefWitnessedComponent,
    FinalisationHeaderComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
  ],
  exports: [
    LanguagePreferencesComponent,
    D255Component,
    DebriefWitnessedComponent,
    FinalisationHeaderComponent,
  ],
})
export class TestFinalisationComponentsModule { }
