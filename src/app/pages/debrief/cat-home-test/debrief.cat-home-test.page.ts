import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { TestFlowPageNames } from '@pages/page-names.constants';

@Component({
  selector: 'app-debrief-cat-home-test',
  templateUrl: './debrief.cat-home-test.page.html',
  styleUrls: ['./debrief.cat-home-test.page.scss'],
})
export class DebriefCatHomeTestPage implements OnInit {

  constructor(
    private navController: NavController,
    public routeByCat: RouteByCategoryProvider,
  ) { }

  ngOnInit() {
  }

  navigateBack(): void {
    this.navController.back();
  }

  async navigatePassFinal(): Promise<void> {
    await this.routeByCat.navigateToPage(TestFlowPageNames.PASS_FINALISATION_PAGE, TestCategory.H);
  }

  async navigatePostDebriefHolding(): Promise<void> {
    await this.routeByCat.navigateToPage(TestFlowPageNames.POST_DEBRIEF_HOLDING_PAGE, TestCategory.H);
  }

}
