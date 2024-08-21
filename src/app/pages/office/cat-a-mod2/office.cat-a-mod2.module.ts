import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '@components/common/common-components.module';
import { DirectivesModule } from '@directives/directives.module';
import { ModeOfTransportCatAMod2Component } from '@pages/office/cat-a-mod2/components/mode-of-transport/mode-of-transport.cat-a-mod2';
import { SafetyAndBalanceCardCatAMod2Component } from '@pages/office/cat-a-mod2/components/safety-and-balance/safety-and-balance.cat-a-mod2';
import { OfficeComponentsModule } from '@pages/office/components/office.components.module';
import { WaitingRoomToCarComponentsModule } from '@pages/waiting-room-to-car/components/waiting-room-to-car.components.module';
import { FaultSummaryProvider } from '@providers/fault-summary/fault-summary';
import { PipesModule } from '@shared/pipes/pipes.module';
import { OfficeCatAMod2PageRoutingModule } from './office.cat-a-mod2-routing.module';
import { OfficeCatAMod2Page } from './office.cat-a-mod2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OfficeCatAMod2PageRoutingModule,
    ComponentsModule,
    OfficeComponentsModule,
    ReactiveFormsModule,
    PipesModule,
    WaitingRoomToCarComponentsModule,
    DirectivesModule,
  ],
  declarations: [OfficeCatAMod2Page, ModeOfTransportCatAMod2Component, SafetyAndBalanceCardCatAMod2Component],
  providers: [FaultSummaryProvider],
})
export class OfficeCatAMod2PageModule {}
