import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ComponentsModule } from '@components/common/common-components.module';
import { TestFlowHeaderComponent } from '@components/common/test-flow-header/test-flow-header.component';
import { DirectivesModule } from '@directives/directives.module';
import { EffectsModule } from '@ngrx/effects';
import { TranslatePipe } from '@ngx-translate/core';
import { CommunicationAnalyticsEffects } from '@pages/communication/communication.analytics.effects';
import { CommunicationEffects } from '@pages/communication/communication.effects';
import { CommunicationComponentsModule } from '@pages/communication/components/communication.components.module';
import { CommunicationPageRoutingModule } from './communication-routing.module';
import { CommunicationPage } from './communication.page';

import { IonicComponentsModule } from '@shared/modules/ionic-components.module';
@NgModule({
  imports: [
    IonicComponentsModule,
    CommonModule,
    FormsModule,

    CommunicationPageRoutingModule,
    ComponentsModule,
    CommunicationComponentsModule,
    ReactiveFormsModule,
    EffectsModule.forFeature([CommunicationEffects, CommunicationAnalyticsEffects]),
    DirectivesModule,
    TestFlowHeaderComponent,
    TranslatePipe,
  ],
  declarations: [CommunicationPage],
})
export class CommunicationPageModule {}
