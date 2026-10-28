import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';

import { IonCol, IonInput, IonRow } from '@ionic/angular';
import { PassCertificateNumberCatAMod1Component } from './pass-certificate-number/pass-certificate-number.cat-a-mod1';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    ReactiveFormsModule,
    IonInput,
    IonCol,
    IonRow,
    PassCertificateNumberCatAMod1Component,
  ],
  exports: [PassCertificateNumberCatAMod1Component],
})
export class PassFinalisationCatAMod1ComponentsModule {}
