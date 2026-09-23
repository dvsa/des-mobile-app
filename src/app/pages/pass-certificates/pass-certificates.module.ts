import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { EffectsModule } from '@ngrx/effects';
import { PassCertificatesAnalyticsEffects } from '@pages/pass-certificates/pass-certificates.analytics.effects';
import { PassCertificatesPageRoutingModule } from './pass-certificates-routing.module';

import { PassCertificatesPage } from './pass-certificates.page';

import { IonicComponentsModule } from '@shared/modules/ionic-components.module';
@NgModule({
  imports: [
    IonicComponentsModule,
    CommonModule,
    FormsModule,

    PassCertificatesPageRoutingModule,
    EffectsModule.forFeature([PassCertificatesAnalyticsEffects]),
  ],
  declarations: [PassCertificatesPage],
})
export class PassCertificatesPageModule {}
