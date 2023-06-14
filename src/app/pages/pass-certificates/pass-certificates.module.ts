import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PassCertificatesPageRoutingModule } from './pass-certificates-routing.module';

import { PassCertificatesPage } from './pass-certificates.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PassCertificatesPageRoutingModule,
  ],
  declarations: [PassCertificatesPage],
})
export class PassCertificatesPageModule {}
