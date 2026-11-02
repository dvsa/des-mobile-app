import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonButton, IonCard, IonCol, IonRow, IonText } from '@ionic/angular';
import { PreviewModeModal } from '@pages/fake-journal/components/preview-mode-modal/preview-mode-modal';

@NgModule({
  imports: [CommonModule, FormsModule, IonCol, IonRow, IonCard, IonText, IonButton, PreviewModeModal],
})
export class PreviewModeModalModule {}
