import { NgModule } from '@angular/core';
import { DirectivesModule } from '@directives/directives.module';
import { IonicModule } from '@ionic/angular';
import { EffectsModule } from '@ngrx/effects';
import { ReversingDistancesProvider } from '@providers/reversing-distances/reversing-distances';
import { ReverseDiagramPage } from './reverse-diagram-modal';
import { ReverseDiagramModalAnalyticsEffects } from './reverse-diagram-modal.analytics.effects';

@NgModule({
  declarations: [ReverseDiagramPage],
  imports: [EffectsModule.forFeature([ReverseDiagramModalAnalyticsEffects]), IonicModule, DirectivesModule],
  providers: [ReversingDistancesProvider],
})
export class ReverseDiagramPageModule {}
