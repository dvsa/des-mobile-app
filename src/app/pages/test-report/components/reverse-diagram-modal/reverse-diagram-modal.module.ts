import { ReverseDiagramPage } from './reverse-diagram-modal';
import { EffectsModule } from '@ngrx/effects';
import { ReverseDiagramModalAnalyticsEffects }
  from './reverse-diagram-modal.analytics.effects';
import { ReversingDistancesProvider } from '@providers/reversing-distances/reversing-distances';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    ReverseDiagramPage,
  ],
  imports: [
    EffectsModule.forFeature([ReverseDiagramModalAnalyticsEffects]),
    IonicModule,
  ],
  providers: [
    ReversingDistancesProvider,
  ],
})
export class ReverseDiagramPageModule { }
