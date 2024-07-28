import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';
import { DirectivesModule } from '@directives/directives.module';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SafetyAndBalanceCardCatAMod2Component } from '@pages/debrief/components/safety-and-balance-card/safety-and-balance-card.cat-a-mod2';
import { SafetyQuestionsCardComponent } from '@pages/debrief/components/safety-questions-card/safety-questions-card';
import { SpeedCheckDebriefCardComponent } from '@pages/debrief/components/speed-check-debrief-card/speed-check-debrief-card';
import { VehicleChecksCardCatBComponent } from '@pages/debrief/components/vehicle-checks-card-cat-b/vehicle-checks-card.cat-b';
import { PipesModule } from '@shared/pipes/pipes.module';
import { DangerousFaultsDebriefCardComponent } from './dangerous-faults-debrief-card/dangerous-faults-debrief-card';
import { DrivingFaultsDebriefCardComponent } from './driving-faults-debrief-card/driving-faults-debrief-card';
import { EcoDebriefCardComponent } from './eco-debrief-card/eco-debrief-card';
import { EtaDebriefCardComponent } from './eta-debrief-card/eta-debrief-card';
import { SeriousFaultsDebriefCardComponent } from './serious-faults-debrief-card/serious-faults-debrief-card';
import { TestOutcomeDebriefCardComponent } from './test-outcome-debrief-card/test-outcome-debrief-card';
import { VehicleChecksCardComponent } from './vehicle-checks-card/vehicle-checks-card';

@NgModule({
  declarations: [
    VehicleChecksCardComponent,
    EtaDebriefCardComponent,
    SafetyQuestionsCardComponent,
    DangerousFaultsDebriefCardComponent,
    SeriousFaultsDebriefCardComponent,
    DrivingFaultsDebriefCardComponent,
    EcoDebriefCardComponent,
    TestOutcomeDebriefCardComponent,
    VehicleChecksCardCatBComponent,
    SpeedCheckDebriefCardComponent,
    SafetyAndBalanceCardCatAMod2Component,
  ],
  imports: [ComponentsModule, CommonModule, IonicModule, TranslateModule, PipesModule, IonicModule, DirectivesModule],
  exports: [
    VehicleChecksCardComponent,
    EtaDebriefCardComponent,
    DangerousFaultsDebriefCardComponent,
    SeriousFaultsDebriefCardComponent,
    DrivingFaultsDebriefCardComponent,
    EcoDebriefCardComponent,
    TestOutcomeDebriefCardComponent,
    VehicleChecksCardCatBComponent,
    SpeedCheckDebriefCardComponent,
    SafetyAndBalanceCardCatAMod2Component,
    SafetyQuestionsCardComponent,
  ],
})
export class DebriefComponentsModule {}
