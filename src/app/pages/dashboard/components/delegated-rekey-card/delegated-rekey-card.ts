import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonCard, IonGrid, IonRow, IonText } from '@ionic/angular';
import { DELEGATED_REKEY_SEARCH_PAGE } from '@pages/page-names.constants';

@Component({
  selector: 'delegated-examiner-rekey',
  templateUrl: 'delegated-rekey-card.html',
  styleUrls: ['delegated-rekey-card.scss'],
  imports: [IonCard, IonGrid, IonRow, IonButton, IonText],
})
export class DelegatedSearchCardComponent {
  constructor(private router: Router) {}

  navigateToDelegatedRekeySearch = async () => {
    await this.router.navigate([DELEGATED_REKEY_SEARCH_PAGE]);
  };
}
