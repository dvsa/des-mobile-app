import { Component, Input } from '@angular/core';
import { SearchResultTestSchema } from '@dvsa/mes-search-schema';
import { DateTime } from '@shared/helpers/date-time';
import { Name } from '@dvsa/mes-test-schema/categories/common';
import { ModalController } from '@ionic/angular';
import { AppComponent } from '@app/app.component';
import * as moment from 'moment';
import { ViewTestResultPage } from '@pages/view-test-result/view-test-result.page';

@Component({
  selector: 'search-result',
  templateUrl: 'search-result.html',
  styleUrls: ['search-result.scss'],
})
export class SearchResultComponent {

  @Input()
  searchResult: SearchResultTestSchema;

  constructor(
    public modalController: ModalController,
    private app: AppComponent,
  ) { }

  getDate(): string {
    return new DateTime(this.searchResult.testDate).format('DD/MM/YYYY');
  }

  getTime(): string {
    return moment(this.searchResult.testDate).format('HH:mm');
  }

  getName(): string {
    const name: Name = this.searchResult.candidateName;
    return name.title ? `${name.title} ${name.firstName} ${name.lastName}` : `${name.firstName} ${name.lastName}`;
  }

  async openTestResult(): Promise<void> {
    const modal = await this.modalController.create({
      component: ViewTestResultPage,
      componentProps: {
        applicationReference: this.searchResult.applicationReference,
        testCategory: this.searchResult.category,
      },
      cssClass: `modal-fullscreen ${this.app.getTextZoomClass()}`,
    });
    await modal.present();
  }
}
