import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';
import { TestSlotComponentsModule } from '@components/test-slot/test-slot-components.module';
import { IonicModule } from '@ionic/angular';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CompressionProvider } from '@providers/compression/compression';
import { DelegatedRekeySearchProvider } from '@providers/delegated-rekey-search/delegated-rekey-search';
import { SearchProvider } from '@providers/search/search';
import { SlotProvider } from '@providers/slot/slot';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from '@directives/directives.module';
import { OrientationMonitorProvider } from '@providers/orientation-monitor/orientation-monitor.provider';
import { DelegatedRekeySearchPage } from './delegated-rekey-search';
import { DelegatedRekeySearchPageRoutingModule } from './delegated-rekey-search-routing.module';
import { DelegatedRekeySearchEffects } from './delegated-rekey-search.effects';
import { delegatedSearchReducer } from './delegated-rekey-search.reducer';

@NgModule({
  declarations: [DelegatedRekeySearchPage],
  imports: [
    StoreModule.forFeature('delegatedRekeySearch', delegatedSearchReducer),
    EffectsModule.forFeature([DelegatedRekeySearchEffects]),
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
