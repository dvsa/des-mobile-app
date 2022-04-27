import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DELEGATED_REKEY_SEARCH_PAGE } from '@pages/page-names.constants';

@Component({
  selector: 'delegated-examiner-rekey',
  templateUrl: 'delegated-rekey-card.html',
  styleUrls: ['delegated-rekey-card.scss'],
})
export class DelegatedSearchCardComponent {

  constructor(private router: Router) { }

  navigateToDelegatedRekeySearch = async () => {
    await this.router.navigate([DELEGATED_REKEY_SEARCH_PAGE]);
  };

}
