import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { LogoutModal } from '@components/common/logout-modal/logout-modal';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [LogoutModal],
})
export class LogoutModalModule {}
