import { Component, OnInit } from '@angular/core';
// import { NavController } from '@ionic/angular';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { TestFlowPageNames } from '@pages/page-names.constants';

@Component({
  selector: 'app-pass-finalisation-cat-home-test',
  templateUrl: './pass-finalisation.cat-home-test.page.html',
  styleUrls: ['./pass-finalisation.cat-home-test.page.scss'],
})
export class PassFinalisationCatHomeTestPage implements OnInit {

  constructor(
    // private navController: NavController,
    public routeByCat: RouteByCategoryProvider,
  ) { }

  ngOnInit() {
  }

  navigateBack(): void {
    // this.navController.back();
  }

  async navigateForward(): Promise<void> {
    await this.routeByCat.navigateToPage(TestFlowPageNames.HEALTH_DECLARATION_PAGE);
  }

}
