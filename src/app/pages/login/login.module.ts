import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';

import { IonicComponentsModule } from '@shared/modules/ionic-components.module';
@NgModule({
  imports: [IonicComponentsModule, CommonModule, FormsModule, LoginPageRoutingModule],
  declarations: [LoginPage],
})
export class LoginPageModule {}
