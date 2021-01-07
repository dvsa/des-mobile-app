import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ProfileHeaderComponent } from './profile-header/profile-header';

@NgModule({
  declarations: [
    ProfileHeaderComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [
    ProfileHeaderComponent,
  ],
})

export class DashboardComponentsModule { }
