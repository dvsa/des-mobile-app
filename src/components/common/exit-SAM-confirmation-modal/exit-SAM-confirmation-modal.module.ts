import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ExitSAMConfirmationModal } from '@components/common/exit-SAM-confirmation-modal/exit-SAM-confirmation-modal';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [ExitSAMConfirmationModal],
})
export class ExitSAMConfirmationModalModule {}
