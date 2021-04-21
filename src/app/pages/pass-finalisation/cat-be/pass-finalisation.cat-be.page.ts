import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

@Component({
  selector: 'app-pass-finalisation-cat-be',
  templateUrl: './pass-finalisation.cat-be.page.html',
  styleUrls: ['./pass-finalisation.cat-be.page.scss'],
})
export class PassFinalisationCatBEPage implements OnInit {

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
    await this.routeByCat.navigateToPage(TestFlowPageNames.HEALTH_DECLARATION_PAGE, TestCategory.BE);
  }

}
