import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { Router } from '@angular/router';

@Component({
  selector: '.test-report-cat-manoeuvre-page',
  templateUrl: './test-report.cat-manoeuvre.page.html',
  styleUrls: ['./test-report.cat-manoeuvre.page.scss'],
})
export class TestReportCatManoeuvrePage implements OnInit {

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
