import { EffectsModule } from '@ngrx/effects';
import { ReversingDistancesProvider } from '@providers/reversing-distances/reversing-distances';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
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
  ],
  providers: [
    ReversingDistancesProvider,
  ],
})
export class ReverseDiagramPageModule { }
