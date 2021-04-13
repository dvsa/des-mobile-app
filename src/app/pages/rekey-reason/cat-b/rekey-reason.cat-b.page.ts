import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { RouteByCategoryProvider } from '../../../providers/route-by-category/route-by-category';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

@Component({
  selector: 'app-rekey-reason.cat-b',
  templateUrl: './rekey-reason.cat-b.page.html',
  styleUrls: ['./rekey-reason.cat-b.page.scss'],
})
export class RekeyReasonCatBPage implements OnInit {

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
    await this.routeByCat.navigateToPage('RekeyUploadOutcomePage');
  }

}
