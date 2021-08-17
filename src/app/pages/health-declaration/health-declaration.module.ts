import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HealthDeclarationPageRoutingModule } from './health-declaration-routing.module';

import { HealthDeclarationPage } from './health-declaration.page';
import { ComponentsModule } from '@components/common/common-components.module';
import { WaitingRoomComponentsModule } from '@pages/waiting-room/components/waiting-room.components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HealthDeclarationPageRoutingModule,
    ComponentsModule,
    WaitingRoomComponentsModule,
    TranslateModule,
    ReactiveFormsModule,
  ],
  declarations: [HealthDeclarationPage],
})
export class HealthDeclarationPageModule {}
