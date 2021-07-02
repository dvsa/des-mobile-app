import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';

import { FaultSummaryProvider } from '@providers/fault-summary/fault-summary';
import { DebriefComponentsModule } from '@pages/debrief/components/debrief-components.module';
import { ComponentsModule } from '@components/common/common-components.module';
import { DebriefPage } from './debrief.page';
import { DebriefPageRoutingModule } from './debrief.routing.module';

@NgModule({
  imports: [
    DebriefComponentsModule,
    ComponentsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    DebriefPageRoutingModule,
    TranslateModule,
  ],
  declarations: [DebriefPage],
  providers: [
    FaultSummaryProvider,
  ],
})
export class DebriefPageModule {}
