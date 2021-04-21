import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { TestFlowPageNames } from '@pages/page-names.constants';

@Component({
  selector: 'app-pass-finalisation-cat-a-mod1',
  templateUrl: './pass-finalisation.cat-a-mod1.page.html',
  styleUrls: ['./pass-finalisation.cat-a-mod1.page.scss'],
})
export class PassFinalisationCatAMod1Page implements OnInit {

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
    await this.routeByCat.navigateToPage(TestFlowPageNames.HEALTH_DECLARATION_PAGE, TestCategory.EUAM1);
  }

}
