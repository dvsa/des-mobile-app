import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { ComponentsModule } from '@components/common/common-components.module';
import { TestSlotComponentsModule } from '@components/test-slot/test-slot-components.module';
import { CompressionProvider } from '@providers/compression/compression';
import { RekeySearchProvider } from '@providers/rekey-search/rekey-search';
import { SearchProvider } from '@providers/search/search';
import { SlotProvider } from '@providers/slot/slot';

import { CommonModule } from '@angular/common';
import { DirectivesModule } from '@directives/directives.module';
import { RekeySearchPageRoutingModule } from '@pages/rekey-search/rekey-search-routing.module';
import { OrientationMonitorProvider } from '@providers/orientation-monitor/orientation-monitor.provider';
import { RekeySearchPage } from './rekey-search';
import { RekeySearchAnalyticsEffects } from './rekey-search.analytics.effects';
import { RekeySearchEffects } from './rekey-search.effects';
import { rekeySearchReducer } from './rekey-search.reducer';

@NgModule({
  declarations: [RekeySearchPage],
  imports: [
    StoreModule.forFeature('rekeySearch', rekeySearchReducer),
    EffectsModule.forFeature([RekeySearchEffects, RekeySearchAnalyticsEffects]),
    ComponentsModule,
    CommonModule,
    TestSlotComponentsModule,
    IonicModule,
    RekeySearchPageRoutingModule,
    DirectivesModule,
  ],
  providers: [OrientationMonitorProvider, RekeySearchProvider, SearchProvider, CompressionProvider, SlotProvider],
})
export class RekeySearchPageModule {}
