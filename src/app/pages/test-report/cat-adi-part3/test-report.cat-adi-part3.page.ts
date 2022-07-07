import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { Router } from '@angular/router';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

@Component({
  selector: 'app-test-report-cat-adi3',
  templateUrl: './test-report.cat-adi-part3.page.html',
  styleUrls: ['./test-report.cat-adi-part3.page.scss'],
})
export class TestReportCatADI3Page implements OnInit {

  constructor(
    private navController: NavController,
    private router: Router,
    private routeByCat: RouteByCategoryProvider,
  ) { }

  ngOnInit() {
  }

  async navigateForward(): Promise<void> {
    await this.router.navigate([TestFlowPageNames.DEBRIEF_PAGE]);
  }
  async navigateToPass(): Promise<void> {
    await this.routeByCat.navigateToPage(TestFlowPageNames.PASS_FINALISATION_PAGE, TestCategory.ADI3);
  }

}
