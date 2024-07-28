import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { ComponentsModule } from '@components/common/common-components.module';
import { DirectivesModule } from '@directives/directives.module';
import { EffectsModule } from '@ngrx/effects';
import { WaitingRoomComponentsModule } from '@pages/waiting-room/components/waiting-room.components.module';
import { WaitingRoomAnalyticsEffects } from '@pages/waiting-room/waiting-room.analytics.effects';
import { PassCertificateValidationProvider } from '@providers/pass-certificate-validation/pass-certificate-validation';
import { WaitingRoomPageRoutingModule } from './waiting-room-routing.module';
import { WaitingRoomPage } from './waiting-room.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EffectsModule.forFeature([WaitingRoomAnalyticsEffects]),
    WaitingRoomPageRoutingModule,
    TranslateModule,
    ComponentsModule,
    ReactiveFormsModule,
    WaitingRoomComponentsModule,
    DirectivesModule,
  ],
  providers: [PassCertificateValidationProvider],
  declarations: [WaitingRoomPage],
})
export class WaitingRoomPageModule {}
