import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { JOURNAL_PAGE } from '../page-names.constants';

@Component({
  selector: 'app-rekey-upload-outcome',
  templateUrl: './rekey-upload-outcome.page.html',
  styleUrls: ['./rekey-upload-outcome.page.scss'],
})
export class RekeyUploadOutcomePage implements OnInit {

  constructor(
    private navController: NavController,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  navigateBack(): void {
    this.navController.back();
  }

  async navigateJournal(): Promise<void> {
    await this.router.navigate([JOURNAL_PAGE]);
  }

}
