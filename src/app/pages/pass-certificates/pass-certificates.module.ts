import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';



import { EffectsModule } from '@ngrx/effects';
import { PassCertificatesAnalyticsEffects } from '@pages/pass-certificates/pass-certificates.analytics.effects';
import { PassCertificatesPageRoutingModule } from './pass-certificates-routing.module';

import { PassCertificatesPage } from './pass-certificates.page';
import {IonButtons, IonContent, IonHeader, IonMenuButton, IonTitle, IonToolbar} from "@ionic/angular";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    PassCertificatesPageRoutingModule,
    EffectsModule.forFeature([PassCertificatesAnalyticsEffects]),
    IonContent,
    IonTitle,
    IonMenuButton,
    IonButtons,
    IonToolbar,
    IonHeader,
  ],
  declarations: [PassCertificatesPage],
})
export class PassCertificatesPageModule {}
