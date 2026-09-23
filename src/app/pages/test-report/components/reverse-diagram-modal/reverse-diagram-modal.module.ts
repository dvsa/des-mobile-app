import { NgModule } from '@angular/core';
import { DirectivesModule } from '@directives/directives.module';

import { EffectsModule } from '@ngrx/effects';
import { ReversingDistancesProvider } from '@providers/reversing-distances/reversing-distances';
import { ReverseDiagramPage } from './reverse-diagram-modal';
import { ReverseDiagramModalAnalyticsEffects } from './reverse-diagram-modal.analytics.effects';

import { IonicComponentsModule } from '@shared/modules/ionic-components.module';
@NgModule({
  declarations: [ReverseDiagramPage],
  imports: [IonicComponentsModule, EffectsModule.forFeature([ReverseDiagramModalAnalyticsEffects]), DirectivesModule],
  providers: [ReversingDistancesProvider],
})
export class ReverseDiagramPageModule {}
