import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';

@Component({
  selector: 'app-debrief.cat-b',
  templateUrl: './debrief.cat-b.page.html',
  styleUrls: ['./debrief.cat-b.page.scss'],
})
export class DebriefCatBPage implements OnInit {

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
    await this.routeByCat.navigateToPage('PASS_FINALISATION_PAGE', TestCategory.B);
  }

  async navigatePostDebriefHolding(): Promise<void> {
    await this.routeByCat.navigateToPage('POST_DEBRIEF_HOLDING_PAGE', TestCategory.B);
  }

}
