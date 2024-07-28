import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from '@app/app.component';
import { DirectivesModule } from '@directives/directives.module';
import { IonicModule } from '@ionic/angular';
import { VRNCaptureModal } from './vrn-capture-modal';

@NgModule({
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule, DirectivesModule],
  declarations: [VRNCaptureModal],
  providers: [AppComponent],
})
export class VRNCaptureModalModule {}
