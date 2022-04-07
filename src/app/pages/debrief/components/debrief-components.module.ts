import { ComponentsModule } from '@components/common/common-components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from '@shared/pipes/pipes.module';
import {
  VehicleChecksCardCatBComponent,
} from '@pages/debrief/components/vehicle-checks-card-cat-b/vehicle-checks-card.cat-b';
import {
  SpeedCheckDebriefCardComponent,
} from '@pages/debrief/components/speed-check-debrief-card/speed-check-debrief-card';
import {
  SafetyAndBalanceCardCatAMod2Component,
} from '@pages/debrief/components/safety-and-balance-card/safety-and-balance-card.cat-a-mod2';
import { EtaDebriefCardComponent } from './eta-debrief-card/eta-debrief-card';
import { DangerousFaultsDebriefCardComponent } from './dangerous-faults-debrief-card/dangerous-faults-debrief-card';
import { SeriousFaultsDebriefCardComponent } from './serious-faults-debrief-card/serious-faults-debrief-card';
import { DrivingFaultsDebriefCardComponent } from './driving-faults-debrief-card/driving-faults-debrief-card';
import { EcoDebriefCardComponent } from './eco-debrief-card/eco-debrief-card';
import { TestOutcomeDebriefCardComponent } from './test-outcome-debrief-card/test-outcome-debrief-card';
import { VehicleChecksCardComponent } from './vehicle-checks-card/vehicle-checks-card';

@NgModule({
  declarations: [
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
  ],
  imports: [
    ComponentsModule,
    CommonModule,
    IonicModule,
    TranslateModule,
    PipesModule,
    IonicModule,
  ],
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
  ],
})
export class DebriefComponentsModule { }
