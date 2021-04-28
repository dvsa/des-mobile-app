import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { TestFlowPageNames } from '@pages/page-names.constants';

@Component({
  selector: 'app-waiting-room-cat-home-test',
  templateUrl: './waiting-room.cat-home-test.page.html',
  styleUrls: ['./waiting-room.cat-home-test.page.scss'],
})
export class WaitingRoomCatHomeTestPage implements OnInit {

  constructor(
    private navController: NavController,
    public routeByCat: RouteByCategoryProvider,
  ) {
  }

  ngOnInit() {
  }

  ionViewWillEnter(): boolean {
    return true;
  }

  ionViewDidLeave() {
  }

  navigateBack(): void {
    this.navController.back();
  }

  async navigateForward(): Promise<void> {
    await this.routeByCat.navigateToPage(TestFlowPageNames.COMMUNICATION_PAGE);
  }
}
