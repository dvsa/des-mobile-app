import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';

import { IonButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';
import { ErrorPage } from './error';

@NgModule({
  declarations: [ErrorPage],
  imports: [CommonModule, ComponentsModule, IonTitle, IonContent, IonButtons, IonButton, IonToolbar, IonHeader],
  exports: [ErrorPage],
})
export class ErrorPageModule {}
