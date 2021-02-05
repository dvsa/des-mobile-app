import { Component } from '@angular/core';
import { Router } from '@angular/router';
// TODO: reinstate when rekey search is implemented
// import { REKEY_SEARCH_PAGE } from '../../../page-names.constants';

@Component({
  selector: 'rekey-search-card',
  templateUrl: 'rekey-search-card.html',
  styleUrls: ['rekey-search-card.scss'],
})

export class RekeySearchCardComponent {

  constructor(private router: Router) { }

  navigateToRekeySearch = () => {
    // this.router.navigate([REKEY_SEARCH_PAGE]);
  };

}
