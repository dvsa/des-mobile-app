import { Component } from '@angular/core';
import { IonCol, IonRow, IonText } from '@ionic/angular';

@Component({
  selector: 'practice-mode-banner',
  templateUrl: 'practice-mode-banner.html',
  styleUrls: ['practice-mode-banner.scss'],
  standalone: true,
  imports: [IonText, IonCol, IonRow],
})
export class PracticeModeBanner {}
