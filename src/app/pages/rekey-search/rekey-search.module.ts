import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { IonicModule } from '@ionic/angular';

import { RekeySearchProvider } from '@providers/rekey-search/rekey-search';
import { CompressionProvider } from '@providers/compression/compression';
import { SlotProvider } from '@providers/slot/slot';
import { SearchProvider } from '@providers/search/search';
import { ComponentsModule } from '@components/common/common-components.module';
import { TestSlotComponentsModule } from '@components/test-slot/test-slot-components.module';

import { rekeySearchReducer } from './rekey-search.reducer';
import { RekeySearchEffects } from './rekey-search.effects';
import { RekeySearchAnalyticsEffects } from './rekey-search.analytics.effects';
import { RekeySearchPage } from './rekey-search';

@NgModule({
  declarations: [
    RekeySearchPage,
  ],
  imports: [
    StoreModule.forFeature('rekeySearch', rekeySearchReducer),
    EffectsModule.forFeature([
      RekeySearchEffects,
      RekeySearchAnalyticsEffects,
    ]),
    ComponentsModule,
    TestSlotComponentsModule,
    IonicModule,
  ],
  providers: [
    RekeySearchProvider,
    SearchProvider,
    CompressionProvider,
    SlotProvider,
  ],
})
export class RekeySearchPageModule {}
