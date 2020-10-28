import { NgModule } from '@angular/core';
import { DrivingFaultsBadgeComponent } from './driving-faults-badge/driving-faults-badge';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { SeriousFaultBadgeComponent } from './serious-fault-badge/serious-fault-badge';
import { DangerousFaultBadgeComponent } from './dangerous-fault-badge/dangerous-fault-badge';

@NgModule({
  declarations: [
    DrivingFaultsBadgeComponent,
    SeriousFaultBadgeComponent,
    DangerousFaultBadgeComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [
    DrivingFaultsBadgeComponent,
    SeriousFaultBadgeComponent,
    DangerousFaultBadgeComponent,
  ]
})
export class CommonComponentsModule { }
