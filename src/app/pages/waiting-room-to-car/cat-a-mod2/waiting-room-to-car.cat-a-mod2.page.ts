import { Component, OnInit } from '@angular/core';
// import { NavController } from '@ionic/angular';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { TestFlowPageNames } from '@pages/page-names.constants';

@Component({
  selector: 'app-waiting-room-to-car-cat-a-mod2',
  templateUrl: './waiting-room-to-car.cat-a-mod2.page.html',
  styleUrls: ['./waiting-room-to-car.cat-a-mod2.page.scss'],
})
export class WaitingRoomToCarCatAMod2Page implements OnInit {

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
    await this.routeByCat.navigateToPage(TestFlowPageNames.TEST_REPORT_PAGE, TestCategory.EUA1M2);
  }

}
