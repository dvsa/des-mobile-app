import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-test-report-cat-c',
  templateUrl: './test-report.cat-c.page.html',
  styleUrls: ['./test-report.cat-c.page.scss'],
})
export class TestReportCatCPage implements OnInit {

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
