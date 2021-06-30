import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-test-report-cat-a-mod1',
  templateUrl: './test-report.cat-a-mod1.page.html',
  styleUrls: ['./test-report.cat-a-mod1.page.scss'],
})
export class TestReportCatAMod1Page implements OnInit {

  constructor(
    private navController: NavController,
    public routeByCat: RouteByCategoryProvider,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  navigateBack(): void {
    this.navController.back();
  }

  async navigateForward(): Promise<void> {
    await this.router.navigate([TestFlowPageNames.DEBRIEF_PAGE]);
  }

}
