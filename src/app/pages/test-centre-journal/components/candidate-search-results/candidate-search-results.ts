import { Component, Input, OnInit } from '@angular/core';
import { isEqual } from 'lodash';
import { CandidateTestSlot } from '../../models/candidate-test-slot';

@Component({
  selector: 'candidate-search-results',
  templateUrl: 'candidate-search-results.html',
  styleUrls: ['candidate-search-results.scss'],
})
export class CandidateSearchResultsComponent implements OnInit {
  @Input()
  slots: CandidateTestSlot[];
  today: Date = new Date();
  tomorrow: Date;
  todaySlots: CandidateTestSlot[];
  tomorrowSlots: CandidateTestSlot[];

  ngOnInit() {
    this.tomorrow = new Date(this.today.getTime() + (24 * 60 * 60 * 1000));
    this.todaySlots = this.slots.filter((candidateTestSlot) => {
      return isEqual(candidateTestSlot.slot.slotDetail.start.substr(0, 10), this.today.toISOString().substr(0, 10));
    });
    this.tomorrowSlots = this.slots.filter((candidateTestSlot) => {
      return isEqual(candidateTestSlot.slot.slotDetail.start.substr(0, 10), this.tomorrow.toISOString().substr(0, 10));
    });
  }
}
