import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { LoginPageRoutingModule } from './login-routing.module';

import { IonButton, IonCol, IonContent, IonHeader, IonRow, IonText, IonTitle, IonToolbar } from '@ionic/angular';
import { LoginPage } from './login.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LoginPageRoutingModule,
    IonTitle,
    IonToolbar,
    IonHeader,
    IonContent,
    IonRow,
    IonCol,
    IonText,
    IonButton,
  ],
  declarations: [LoginPage],
})
export class LoginPageModule {}
