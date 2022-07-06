import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-test-report-cat-adi3',
  templateUrl: './test-report.cat-adi-part3.page.html',
  styleUrls: ['./test-report.cat-adi-part3.page.scss'],
})
export class TestReportCatADI3Page implements OnInit {

  constructor(
    private navController: NavController,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  async navigateForward(): Promise<void> {
    await this.router.navigate([TestFlowPageNames.DEBRIEF_PAGE]);
  }

}
