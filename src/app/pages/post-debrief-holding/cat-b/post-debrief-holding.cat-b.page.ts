import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { RouteByCategoryProvider } from '../../../providers/route-by-category/route-by-category';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

@Component({
  selector: 'app-post-debrief-holding.cat-b',
  templateUrl: './post-debrief-holding.cat-b.page.html',
  styleUrls: ['./post-debrief-holding.cat-b.page.scss'],
})
export class PostDebriefHoldingCatBPage implements OnInit {

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
    await this.routeByCat.navigateToPage('NON_PASS_FINALISATION_PAGE', TestCategory.B);
  }

}
