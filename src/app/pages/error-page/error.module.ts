import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';

import { IonButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';
import { ErrorPage } from './error';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonToolbar,
    IonHeader,
    ErrorPage,
  ],
  exports: [ErrorPage],
})
export class ErrorPageModule {}
