import { Component, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'examiner-records-learn-more-modal',
  templateUrl: 'examiner-records-learn-more-modal.html',
  styleUrls: ['examiner-records-learn-more-modal.scss'],
})
export class ExaminerRecordsLearnMoreModal {
  @ViewChild('swiperContainer') swiperContainer;

  constructor(public modalCtrl: ModalController) {}

  nextSwipe() {
    if (this.swiperContainer) {
      this.swiperContainer.nativeElement.swiper.slideNext();
    }
  }

  previousSwipe() {
    if (this.swiperContainer) {
      this.swiperContainer.nativeElement.swiper.slidePrev();
    }
  }

  async onOk() {
    await this.modalCtrl.dismiss();
  }
}
