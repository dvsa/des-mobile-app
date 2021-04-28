import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { TestFlowPageNames } from '@pages/page-names.constants';

@Component({
  selector: 'app-waiting-room-cat-c',
  templateUrl: './waiting-room.cat-c.page.html',
  styleUrls: ['./waiting-room.cat-c.page.scss'],
})
export class WaitingRoomCatCPage implements OnInit {

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
