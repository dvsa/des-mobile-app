import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { WaitingRoomCatBPageRoutingModule } from './waiting-room-routing.module';
import { WaitingRoomPage } from './waiting-room.page';
import { EffectsModule } from '@ngrx/effects';
import { ComponentsModule } from '@components/common/common-components.module';
import { WaitingRoomComponentsModule } from '@pages/waiting-room/components/waiting-room.components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WaitingRoomCatBPageRoutingModule,
    TranslateModule,
    ComponentsModule,
    ReactiveFormsModule,
    WaitingRoomComponentsModule,
  ],
  declarations: [WaitingRoomPage],
})
export class WaitingRoomCatBPageModule {}
