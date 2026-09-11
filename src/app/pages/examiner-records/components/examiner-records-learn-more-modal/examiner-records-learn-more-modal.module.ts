import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';


import { ComponentsModule } from '@components/common/common-components.module';
import { ExaminerRecordsLearnMoreModal } from '@pages/examiner-records/components/examiner-records-learn-more-modal/examiner-records-learn-more-modal';
import {
  IonButton,
  IonButtons,
  IonCard, IonCol, IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonRow, IonText,
  IonTitle,
  IonToolbar
} from "@ionic/angular";

@NgModule({
  imports: [CommonModule, FormsModule, ComponentsModule, IonHeader, IonCard, IonTitle, IonToolbar, IonLabel, IonIcon, IonButton, IonButtons, IonRow, IonContent, IonText, IonCol],
  declarations: [ExaminerRecordsLearnMoreModal],
})
export class ExaminerRecordsLearnMoreModalModule {}
