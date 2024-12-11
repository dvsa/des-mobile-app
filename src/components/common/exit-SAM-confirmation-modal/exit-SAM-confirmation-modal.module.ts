import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import {ExitSAMConfirmationModal} from '@components/common/exit-SAM-confirmation-modal/exit-SAM-confirmation-modal';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [ExitSAMConfirmationModal],
})
export class ExitSAMConfirmationModalModule {}
