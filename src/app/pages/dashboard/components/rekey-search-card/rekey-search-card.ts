import { NgOptimizedImage } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonGrid, IonRow, IonText } from '@ionic/angular';
import { REKEY_SEARCH_PAGE } from '@pages/page-names.constants';

@Component({
  selector: 'rekey-search-card',
  templateUrl: 'rekey-search-card.html',
  styleUrls: ['rekey-search-card.scss'],
  imports: [IonButton, IonGrid, IonRow, NgOptimizedImage, IonText],
})
export class RekeySearchCardComponent {
  @Input() isDelegatedExaminer = false;

  constructor(private router: Router) {}

  navigateToRekeySearch = async () => {
    await this.router.navigate([REKEY_SEARCH_PAGE]);
  };
}
