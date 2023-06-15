import { Component, OnInit } from '@angular/core';
import { PassCertificatedViewDidEnter } from '@pages/pass-certificates/pass-certificates.actions';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';

@Component({
  selector: 'pass-certificates',
  templateUrl: './pass-certificates.page.html',
  styleUrls: ['./pass-certificates.page.scss'],
})
export class PassCertificatesPage implements OnInit {

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
