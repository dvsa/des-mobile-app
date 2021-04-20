import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { TestFlowPageNames } from '@pages/page-names.constants';

@Component({
  selector: 'app-post-debrief-holding-cat-d',
  templateUrl: './post-debrief-holding.cat-d.page.html',
  styleUrls: ['./post-debrief-holding.cat-d.page.scss'],
})
export class PostDebriefHoldingCatDPage implements OnInit {

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
    await this.routeByCat.navigateToPage(TestFlowPageNames.NON_PASS_FINALISATION_PAGE, TestCategory.D);
  }

}
