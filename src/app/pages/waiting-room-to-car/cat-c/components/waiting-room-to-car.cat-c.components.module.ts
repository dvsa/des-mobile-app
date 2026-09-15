import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';

import { VehicleChecksModalCatCModule } from '@pages/waiting-room-to-car/cat-c/components/vehicle-checks-modal/vehicle-checks-modal.cat-c.page.module';

@NgModule({
  imports: [ComponentsModule, ReactiveFormsModule, CommonModule, VehicleChecksModalCatCModule],
})
export class WaitingRoomToCarCatCComponentsModule {}
