import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '@components/common/common-components.module';
import { TranslateModule } from '@ngx-translate/core';
import { CommunicationComponentsModule } from '@pages/communication/components/communication.components.module';
import { EffectsModule } from '@ngrx/effects';
import { CommunicationEffects } from '@pages/communication/communication.effects';
import { CommunicationAnalyticsEffects } from '@pages/communication/communication.analytics.effects';
import { CommunicationPageRoutingModule } from './communication-routing.module';
import { CommunicationPage } from './communication.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommunicationPageRoutingModule,
    ComponentsModule,
    TranslateModule,
    CommunicationComponentsModule,
    ReactiveFormsModule,
    EffectsModule.forFeature([
      CommunicationEffects,
      CommunicationAnalyticsEffects,
    ]),
  ],
  declarations: [CommunicationPage],
})
export class CommunicationPageModule {}
