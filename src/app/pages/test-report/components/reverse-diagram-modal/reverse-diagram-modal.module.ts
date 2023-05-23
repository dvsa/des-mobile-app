import { EffectsModule } from '@ngrx/effects';
import { ReversingDistancesProvider } from '@providers/reversing-distances/reversing-distances';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '@components/common/common-components.module';
import { ReverseDiagramModalAnalyticsEffects }
  from './reverse-diagram-modal.analytics.effects';
import { ReverseDiagramPage } from './reverse-diagram-modal';

@NgModule({
  declarations: [
    ReverseDiagramPage,
  ],
  imports: [
    EffectsModule.forFeature([ReverseDiagramModalAnalyticsEffects]),
    IonicModule,
    ComponentsModule,
  ],
  providers: [
    ReversingDistancesProvider,
  ],
})
export class ReverseDiagramPageModule { }
