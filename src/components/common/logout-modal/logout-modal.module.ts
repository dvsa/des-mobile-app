import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LogoutModal } from '@components/common/logout-modal/logout-modal';

import { IonicComponentsModule } from '@shared/modules/ionic-components.module';
@NgModule({
  imports: [IonicComponentsModule, CommonModule],
  declarations: [LogoutModal],
})
export class LogoutModalModule {}
