import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { JOURNAL_PAGE, TestFlowPageNames } from '../../page-names.constants';

@Component({
  selector: 'app-office-cat-d',
  templateUrl: './office.cat-d.page.html',
  styleUrls: ['./office.cat-d.page.scss'],
})
export class OfficeCatDPage implements OnInit {

  constructor(
    private navController: NavController,
    public routeByCat: RouteByCategoryProvider,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  navigateBack(): void {
    this.navController.back();
  }

  async navigateForward(): Promise<void> {
    await this.routeByCat.navigateToPage(TestFlowPageNames.REKEY_REASON_PAGE);
  }

  async navigateJournal(): Promise<void> {
    await this.router.navigate([JOURNAL_PAGE]);
  }

}
