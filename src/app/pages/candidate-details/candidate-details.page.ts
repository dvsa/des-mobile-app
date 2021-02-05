import { Component, OnInit } from '@angular/core';
import { Business, TestSlot } from '@dvsa/mes-journal-schema';
import { ModalController } from '@ionic/angular';
import { Details } from './candidate-details.page.model';

interface CandidateDetailsPageState {
  name: string;
  time: string;
  details: Details;
  business: Business;
}

@Component({
  selector: 'app-candidate-details',
  templateUrl: './candidate-details.page.html',
  styleUrls: ['./candidate-details.page.scss'],
})
export class CandidateDetailsPage implements OnInit {
  pageState: CandidateDetailsPageState;
  slot: TestSlot;
  slotChanged: boolean = false;

  constructor(
    public modalController: ModalController,
  ) { }

  ngOnInit() {
  }

  dismiss() {
    this.modalController.dismiss();
  }

}
