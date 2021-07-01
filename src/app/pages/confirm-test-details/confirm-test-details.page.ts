import { Component, OnInit } from '@angular/core';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-test-details',
  templateUrl: './confirm-test-details.page.html',
  styleUrls: ['./confirm-test-details.page.scss'],
})
export class ConfirmTestDetailsPage implements OnInit {
  constructor(
    public routeByCat: RouteByCategoryProvider,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  navigateBack(): void {
    this.navController.back();
  }

  async navigateDebrief(): Promise<void> {
    await this.router.navigate([TestFlowPageNames.DEBRIEF_PAGE]);
  }

  async navigateBackToOffice(): Promise<void> {
    await this.routeByCat.navigateToPage(TestFlowPageNames.BACK_TO_OFFICE_PAGE);
  }

}
