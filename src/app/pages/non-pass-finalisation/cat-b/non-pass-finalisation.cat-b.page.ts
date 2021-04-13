import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';

@Component({
  selector: 'app-non-pass-finalisation.cat-b',
  templateUrl: './non-pass-finalisation.cat-b.page.html',
  styleUrls: ['./non-pass-finalisation.cat-b.page.scss'],
})
export class NonPassFinalisationCatBPage implements OnInit {

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
    await this.routeByCat.navigateToPage('ConfirmTestDetailsPage');
  }

}
