import { NgModule } from '@angular/core';

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
import { MaskitoDirective } from '@maskito/angular';
import { RekeySearchPageRoutingModule } from '@pages/rekey-search/rekey-search-routing.module';
import { OrientationMonitorProvider } from '@providers/orientation-monitor/orientation-monitor.provider';
import { RekeySearchPage } from './rekey-search';
import { RekeySearchAnalyticsEffects } from './rekey-search.analytics.effects';
import { RekeySearchEffects } from './rekey-search.effects';
import { rekeySearchReducer } from './rekey-search.reducer';
import {
  IonBackButton,
  IonButton, IonButtons,
  IonCol,
  IonContent,
  IonGrid, IonHeader,
  IonIcon,
  IonInput,
  IonRow,
  IonSpinner,
  IonText, IonTitle,
  IonToolbar
} from '@ionic/angular';

@NgModule({
  declarations: [RekeySearchPage],
  imports: [
    StoreModule.forFeature('rekeySearch', rekeySearchReducer),
    EffectsModule.forFeature([RekeySearchEffects, RekeySearchAnalyticsEffects]),
    ComponentsModule,
    CommonModule,
    TestSlotComponentsModule,

    RekeySearchPageRoutingModule,
    DirectivesModule,
    MaskitoDirective,
    IonInput,
    IonCol,
    IonRow,
    IonGrid,
    IonContent,
    IonIcon,
    IonText,
    IonSpinner,
    IonButton,
    IonToolbar,
    IonHeader,
    IonBackButton,
    IonButtons,
    IonTitle,
  ],
  providers: [OrientationMonitorProvider, RekeySearchProvider, SearchProvider, CompressionProvider, SlotProvider],
})
export class RekeySearchPageModule {}
