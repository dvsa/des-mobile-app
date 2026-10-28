import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonCol, IonGrid, IonRow, IonText } from '@ionic/angular';
import { FAKE_JOURNAL_PAGE } from '@pages/page-names.constants';

@Component({
  selector: 'practice-end-to-end-card',
  templateUrl: 'practice-end-to-end-card.html',
  styleUrls: ['practice-end-to-end-card.scss'],
  imports: [IonButton, IonGrid, IonRow, IonCol, NgOptimizedImage, IonText],
})
export class PracticeEndToEndCardComponent {
  constructor(private router: Router) {}

  navigateToFakeJournal = async () => {
    await this.router.navigate([FAKE_JOURNAL_PAGE]);
  };
}
