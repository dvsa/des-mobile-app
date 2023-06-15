import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EffectsModule } from '@ngrx/effects';
import { PassCertificatesAnalyticsEffects } from '@pages/pass-certificates/pass-certificates.analytics.effects';
import { PassCertificatesPageRoutingModule } from './pass-certificates-routing.module';

import { PassCertificatesPage } from './pass-certificates.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PassCertificatesPageRoutingModule,
    EffectsModule.forFeature([
      PassCertificatesAnalyticsEffects,
    ]),
  ],
  declarations: [PassCertificatesPage],
})
export class PassCertificatesPageModule {}
