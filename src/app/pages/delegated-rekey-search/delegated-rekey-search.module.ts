import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { IonicModule } from '@ionic/angular';
import { DelegatedRekeySearchProvider } from '@providers/delegated-rekey-search/delegated-rekey-search';
import { CompressionProvider } from '@providers/compression/compression';
import { SlotProvider } from '@providers/slot/slot';
import { SearchProvider } from '@providers/search/search';
import { ComponentsModule } from '@components/common/common-components.module';
import { TestSlotComponentsModule } from '@components/test-slot/test-slot-components.module';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from '@directives/directives.module';
import { OrientationMonitorProvider } from '@providers/orientation-monitor/orientation-monitor.provider';
import { DelegatedRekeySearchPageRoutingModule } from './delegated-rekey-search-routing.module';
import { delegatedSearchReducer } from './delegated-rekey-search.reducer';
import { DelegatedRekeySearchEffects } from './delegated-rekey-search.effects';
import { DelegatedRekeySearchPage } from './delegated-rekey-search';

@NgModule({
  declarations: [
    DelegatedRekeySearchPage,
  ],
  imports: [
    StoreModule.forFeature('delegatedRekeySearch', delegatedSearchReducer),
    EffectsModule.forFeature([
      DelegatedRekeySearchEffects,
    ]),
    ComponentsModule,
    TestSlotComponentsModule,
    IonicModule,
    DelegatedRekeySearchPageRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    DirectivesModule,
  ],
  providers: [
    OrientationMonitorProvider,
    DelegatedRekeySearchProvider,
    SearchProvider,
    CompressionProvider,
    SlotProvider,
  ],
})
export class DelegatedRekeySearchPageModule {}
