import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from '@app/app.component';
import { DirectivesModule } from '@directives/directives.module';
import { VRNCaptureModal } from './vrn-capture-modal';

import { IonicComponentsModule } from '@shared/modules/ionic-components.module';
@NgModule({
  imports: [IonicComponentsModule, CommonModule, FormsModule, ReactiveFormsModule, DirectivesModule],
  declarations: [VRNCaptureModal],
  providers: [AppComponent],
})
export class VRNCaptureModalModule {}
