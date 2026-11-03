import { NgModule } from '@angular/core';

import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonLabel,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { ReversingDistancesProvider } from '@providers/reversing-distances/reversing-distances';
import { ReverseDiagramPage } from './reverse-diagram-modal';

@NgModule({
  imports: [
    IonCol,
    IonRow,
    IonLabel,
    IonTitle,
    IonIcon,
    IonButton,
    IonButtons,
    IonToolbar,
    IonHeader,
    IonGrid,
    IonContent,
    IonText,
    ReverseDiagramPage,
  ],
  providers: [ReversingDistancesProvider],
})
export class ReverseDiagramPageModule {}
