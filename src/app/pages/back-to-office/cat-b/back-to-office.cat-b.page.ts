import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';

@Component({
  selector: 'app-back-to-office.cat-b',
  templateUrl: './back-to-office.cat-b.page.html',
  styleUrls: ['./back-to-office.cat-b.page.scss'],
})
export class BackToOfficeCatBPage implements OnInit {

  constructor(
    private navController: NavController,
    public routeByCat: RouteByCategoryProvider,
  ) { }

  ngOnInit() {
  }

  navigateBack(): void {
    this.navController.back();
  }

  async navigateForward(): Promise<void> {
    await this.routeByCat.navigateToPage('OFFICE_PAGE', TestCategory.B);
  }

}
