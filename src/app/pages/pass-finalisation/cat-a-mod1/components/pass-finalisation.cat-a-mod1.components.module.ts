import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';
import { DirectivesModule } from '@directives/directives.module';

import { PassCertificateNumberCatAMod1Component } from './pass-certificate-number/pass-certificate-number.cat-a-mod1';

import { IonicComponentsModule } from '@shared/modules/ionic-components.module';
@NgModule({
  declarations: [PassCertificateNumberCatAMod1Component],
  imports: [IonicComponentsModule, CommonModule, ComponentsModule, ReactiveFormsModule, DirectivesModule],
  exports: [PassCertificateNumberCatAMod1Component],
})
export class PassFinalisationCatAMod1ComponentsModule {}
