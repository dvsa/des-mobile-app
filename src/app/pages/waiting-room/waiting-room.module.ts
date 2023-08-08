import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { EffectsModule } from '@ngrx/effects';

import { WaitingRoomEffects } from '@pages/waiting-room/waiting-room.effects';
import { PassCertificateValidationProvider } from '@providers/pass-certificate-validation/pass-certificate-validation';
import { ComponentsModule } from '@components/common/common-components.module';
import { WaitingRoomComponentsModule } from '@pages/waiting-room/components/waiting-room.components.module';
import { WaitingRoomAnalyticsEffects } from '@pages/waiting-room/waiting-room.analytics.effects';
import { WaitingRoomPage } from './waiting-room.page';
import { WaitingRoomPageRoutingModule } from './waiting-room-routing.module';

@NgModule({
  declarations: [WaitingRoomPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EffectsModule.forFeature([
      WaitingRoomEffects,
      WaitingRoomAnalyticsEffects,
    ]),
    WaitingRoomPageRoutingModule,
    TranslateModule,
    ComponentsModule,
    ReactiveFormsModule,
    WaitingRoomComponentsModule,
  ],
  providers: [PassCertificateValidationProvider],
})
export class WaitingRoomPageModule {
}
