import { Component, OnInit } from '@angular/core';
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonTitle, IonToolbar } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { PassCertificatedViewDidEnter } from '@pages/pass-certificates/pass-certificates.actions';
import { StoreModel } from '@shared/models/store.model';

@Component({
  selector: 'pass-certificates',
  templateUrl: './pass-certificates.page.html',
  styleUrls: ['./pass-certificates.page.scss'],
  imports: [IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent],
})
export class PassCertificatesPage implements OnInit {
  constructor(public store$: Store<StoreModel>) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.store$.dispatch(PassCertificatedViewDidEnter());
  }
}
