import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { BasePageComponent } from '../../shared/classes/base-page';
import { AuthenticationProvider } from '../../providers/authentication/authentication';

@Component({
  selector: 'app-test-centre-journal',
  templateUrl: 'test-centre-journal.page.html',
  styleUrls: ['test-centre-journal.page.scss'],
})
export class TestCentreJournalPage extends BasePageComponent {

  constructor(
    public platform: Platform,
    public authenticationProvider: AuthenticationProvider,
    public router: Router,
  ) {
    super(platform, authenticationProvider, router);
  }

  ionViewWillEnter() {
    super.ionViewWillEnter();
  }
}
