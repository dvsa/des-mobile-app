import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { RouteByCategoryProvider } from '../../../providers/route-by-category/route-by-category';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { Router } from '@angular/router';
import { JOURNAL_PAGE } from '../../page-names.constants';

@Component({
  selector: 'app-office.cat-b',
  templateUrl: './office.cat-b.page.html',
  styleUrls: ['./office.cat-b.page.scss'],
})
export class OfficeCatBPage implements OnInit {

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
    await this.routeByCat.navigateToPage('REKEY_REASON_PAGE', TestCategory.B);
  }

  async navigateJournal(): Promise<void> {
    await this.router.navigate([JOURNAL_PAGE]);
  }

}
