import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommunicationPageRoutingModule } from './communication-routing.module';

import { CommunicationPage } from './communication.page';
import { ComponentsModule } from '@components/common/common-components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommunicationPageRoutingModule,
    ComponentsModule,
    TranslateModule,
  ],
  declarations: [CommunicationPage],
})
export class CommunicationPageModule {}
