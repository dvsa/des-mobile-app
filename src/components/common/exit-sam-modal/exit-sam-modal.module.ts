import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { ExitSamModal } from '@components/common/exit-sam-modal/exit-sam-modal';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [ExitSamModal],
})
export class ExitSamModalModule {}
