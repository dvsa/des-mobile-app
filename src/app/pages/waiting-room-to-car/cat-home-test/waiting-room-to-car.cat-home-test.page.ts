import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { TestFlowPageNames } from '@pages/page-names.constants';

@Component({
  selector: 'app-waiting-room-to-car-cat-home-test',
  templateUrl: './waiting-room-to-car.cat-home-test.page.html',
  styleUrls: ['./waiting-room-to-car.cat-home-test.page.scss'],
})
export class WaitingRoomToCarCatHomeTestPage implements OnInit {

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
    await this.routeByCat.navigateToPage(TestFlowPageNames.TEST_REPORT_PAGE, TestCategory.H);
  }

}
