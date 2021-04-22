import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { TestFlowPageNames } from '@pages/page-names.constants';

@Component({
  selector: 'app-rekey-reason-cat-home-test',
  templateUrl: './rekey-reason.cat-home-test.page.html',
  styleUrls: ['./rekey-reason.cat-home-test.page.scss'],
})
export class RekeyReasonCatHomeTestPage implements OnInit {

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
    await this.routeByCat.navigateToPage(TestFlowPageNames.REKEY_UPLOAD_OUTCOME_PAGE);
  }

}
