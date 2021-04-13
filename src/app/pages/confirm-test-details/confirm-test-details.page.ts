import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { RouteByCategoryProvider } from '../../providers/route-by-category/route-by-category';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

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
    await this.routeByCat.navigateToPage('DEBRIEF_PAGE', TestCategory.B);
  }

  async navigateBackToOffice(): Promise<void> {
    await this.routeByCat.navigateToPage('BACK_TO_OFFICE_PAGE', TestCategory.B);
  }

}
