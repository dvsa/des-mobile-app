import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-test-report-cat-a-mod2',
  templateUrl: './test-report.cat-a-mod2.page.html',
  styleUrls: ['./test-report.cat-a-mod2.page.scss'],
})
export class TestReportCatAMod2Page implements OnInit {

  constructor(
    private navController: NavController,
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
