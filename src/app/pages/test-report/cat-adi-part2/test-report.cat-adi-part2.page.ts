import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-test-report-cat-adi-part2',
  templateUrl: './test-report.cat-adi-part2.page.html',
  styleUrls: ['./test-report.cat-adi-part2.page.scss'],
})
export class TestReportCatAdiPart2Page implements OnInit {

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
