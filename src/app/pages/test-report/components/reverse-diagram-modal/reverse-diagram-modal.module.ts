import { NgModule } from '@angular/core';
import { DirectivesModule } from '@directives/directives.module';

import { EffectsModule } from '@ngrx/effects';
import { ReversingDistancesProvider } from '@providers/reversing-distances/reversing-distances';
import { ReverseDiagramPage } from './reverse-diagram-modal';
import { ReverseDiagramModalAnalyticsEffects } from './reverse-diagram-modal.analytics.effects';
import {
  IonButton,
  IonButtons,
  IonCol, IonContent, IonGrid,
  IonHeader,
  IonIcon,
  IonLabel,
  IonRow, IonText,
  IonTitle,
  IonToolbar
} from "@ionic/angular";

@NgModule({
  declarations: [ReverseDiagramPage],
  imports: [EffectsModule.forFeature([ReverseDiagramModalAnalyticsEffects]), DirectivesModule, IonCol, IonRow, IonLabel, IonTitle, IonIcon, IonButton, IonButtons, IonToolbar, IonHeader, IonGrid, IonContent, IonText],
  providers: [ReversingDistancesProvider],
})
export class ReverseDiagramPageModule {}
