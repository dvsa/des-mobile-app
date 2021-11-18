import { Component } from '@angular/core';
import { DASHBOARD_PAGE } from '@pages/page-names.constants';
import { Router } from '@angular/router';

@Component({
  selector: 'practice-mode-banner',
  templateUrl: 'practice-mode-banner.html',
  styleUrls: ['practice-mode-banner.scss'],

})

export class PracticeModeBanner {

  constructor(
    public router: Router,
  ) {}

  async exitPracticeMode() {
    await this.router.navigate([DASHBOARD_PAGE], { replaceUrl: true });
  }
}
