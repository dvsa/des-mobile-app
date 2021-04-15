import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

@Component({
  selector: 'app-debrief-cat-be',
  templateUrl: './debrief.cat-be.page.html',
  styleUrls: ['./debrief.cat-be.page.scss'],
})
export class DebriefCatBePage implements OnInit {

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
    await this.routeByCat.navigateToPage(TestFlowPageNames.PASS_FINALISATION_PAGE, TestCategory.B);
  }

  async navigatePostDebriefHolding(): Promise<void> {
    await this.routeByCat.navigateToPage(TestFlowPageNames.POST_DEBRIEF_HOLDING_PAGE, TestCategory.B);
  }

}
