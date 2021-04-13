import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { RouteByCategoryProvider } from '../../../providers/route-by-category/route-by-category';

@Component({
  selector: 'app-health-declaration.cat-b',
  templateUrl: './health-declaration.cat-b.page.html',
  styleUrls: ['./health-declaration.cat-b.page.scss'],
})
export class HealthDeclarationCatBPage implements OnInit {

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
