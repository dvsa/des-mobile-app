import { Component, OnInit } from '@angular/core';
// import { NavController } from '@ionic/angular';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { TestFlowPageNames } from '@pages/page-names.constants';

@Component({
  selector: 'app-debrief-cat-a-mod2',
  templateUrl: './debrief.cat-a-mod2.page.html',
  styleUrls: ['./debrief.cat-a-mod2.page.scss'],
})
export class DebriefCatAMod2Page implements OnInit {

  constructor(
    // private navController: NavController,
    public routeByCat: RouteByCategoryProvider,
  ) { }

  ngOnInit() {
  }

  navigateBack(): void {
    // this.navController.back();
  }

  async navigatePassFinal(): Promise<void> {
    await this.routeByCat.navigateToPage(TestFlowPageNames.PASS_FINALISATION_PAGE, TestCategory.EUA1M2);
  }

  async navigatePostDebriefHolding(): Promise<void> {
    await this.routeByCat.navigateToPage(TestFlowPageNames.POST_DEBRIEF_HOLDING_PAGE);
  }

}
