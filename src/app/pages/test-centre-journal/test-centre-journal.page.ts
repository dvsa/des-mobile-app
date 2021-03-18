import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BasePageComponent } from '../../shared/classes/base-page';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { NetworkStateProvider } from '../../providers/network-state/network-state';

interface TestCentreJournalPageState {
  isOffline$: Observable<boolean>;
}

@Component({
  selector: 'app-test-centre-journal',
  templateUrl: 'test-centre-journal.page.html',
  styleUrls: ['test-centre-journal.page.scss'],
})
export class TestCentreJournalPage extends BasePageComponent {

  pageState: TestCentreJournalPageState;

  constructor(
    public platform: Platform,
    public authenticationProvider: AuthenticationProvider,
    public router: Router,
    private networkStateProvider: NetworkStateProvider,
  ) {
    super(platform, authenticationProvider, router);
  }

  ngOnInit() {
    this.pageState = {
      isOffline$: this.networkStateProvider.isOffline$,
    };
  }

  ionViewWillEnter() {
    super.ionViewWillEnter();
  }
}
