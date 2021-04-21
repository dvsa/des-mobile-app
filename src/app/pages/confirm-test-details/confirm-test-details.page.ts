import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { TestFlowPageNames } from '@pages/page-names.constants';

@Component({
  selector: 'app-confirm-test-details',
  templateUrl: './confirm-test-details.page.html',
  styleUrls: ['./confirm-test-details.page.scss'],
})
export class ConfirmTestDetailsPage implements OnInit {
  constructor(
    private navController: NavController,
    public routeByCat: RouteByCategoryProvider,
  ) { }

  ngOnInit() {
  }

  navigateBack(): void {
    this.navController.back();
  }

  async navigateDebrief(): Promise<void> {
    await this.routeByCat.navigateToPage(TestFlowPageNames.DEBRIEF_PAGE, TestCategory.B);
  }

  async navigateBackToOffice(): Promise<void> {
    await this.routeByCat.navigateToPage(TestFlowPageNames.BACK_TO_OFFICE_PAGE, TestCategory.B);
  }

}
