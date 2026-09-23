import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ExitRekeyModal } from './exit-rekey-modal';

import { IonicComponentsModule } from '@shared/modules/ionic-components.module';
@NgModule({
  declarations: [ExitRekeyModal],
  imports: [IonicComponentsModule, CommonModule],
  exports: [ExitRekeyModal],
})
export class ExitRekeyModalModule {}
