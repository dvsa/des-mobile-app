import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PreferencesRoutingModule } from '@pages/preferences/preferences.routing.module';
import { PreferencesPage } from '@pages/preferences/preferences.page';
import { RekeyReasonComponentsModule } from '@pages/rekey-reason/components/rekey-reason.components.module';

@NgModule({
  declarations: [
    PreferencesPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PreferencesRoutingModule,
    ReactiveFormsModule,
    EffectsModule.forFeature([]),
    RekeyReasonComponentsModule,
  ],
})
export class PreferencesModule {
}
