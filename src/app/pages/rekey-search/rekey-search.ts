import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { BasePageComponent } from '@shared/classes/base-page';

@Component({
  selector: 'page-rekey-search',
  templateUrl: 'rekey-search.html',
})
export class RekeySearchPage extends BasePageComponent {
  constructor(
    protected platform: Platform,
    protected authenticationProvider: AuthenticationProvider,
    protected router: Router,
  ) {
    super(platform, authenticationProvider, router);
  }
}
