import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '@components/common/common-components.module';
import { TranslateModule } from '@ngx-translate/core';
import { CommunicationComponentsModule } from '@pages/communication/components/communication.components.module';
import { CommunicationPage } from './communication.page';
import { CommunicationPageRoutingModule } from './communication-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommunicationPageRoutingModule,
    ComponentsModule,
    TranslateModule,
    CommunicationComponentsModule,
    ReactiveFormsModule,
  ],
  declarations: [CommunicationPage],
})
export class CommunicationPageModule {}
