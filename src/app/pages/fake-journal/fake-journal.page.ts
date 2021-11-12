import { Component } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { BasePageComponent } from '@shared/classes/base-page';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { Router } from '@angular/router';
import { fakeJournalTestSlots } from '@pages/fake-journal/__mocks__/fake-journal.mock';
import * as moment from 'moment';

@Component({
  selector: 'app-rekey-reason',
  templateUrl: './fake-journal.page.html',
  styleUrls: ['./fake-journal.page.scss'],
})
export class FakeJournalPage extends BasePageComponent {

  dateToDisplay: string;
  slots = fakeJournalTestSlots;

  constructor(
    private navController: NavController,
    public routeByCat: RouteByCategoryProvider,
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
  ) {
    super(platform, authenticationProvider, router);

    this.dateToDisplay = moment().format('dddd D MMMM YYYY');
    console.log('this.dateToDisplay', this.dateToDisplay);
  }

}
