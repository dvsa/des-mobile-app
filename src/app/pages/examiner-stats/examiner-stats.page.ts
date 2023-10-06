import { Component, OnInit } from '@angular/core';
import { PassCertificatedViewDidEnter } from '@pages/pass-certificates/pass-certificates.actions';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';

@Component({
  selector: 'examiner-stats',
  templateUrl: './examiner-stats.page.html',
  styleUrls: ['./examiner-stats.page.scss'],
})
export class ExaminerStatsPage implements OnInit {

  constructor(
    public store$: Store<StoreModel>,
  ) {
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.store$.dispatch(PassCertificatedViewDidEnter());
  }
}
