import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AppComponent } from '@app/app.component';
import { VRNCaptureModal } from './vrn-capture-modal';
import { DirectivesModule } from '@directives/directives.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    DirectivesModule,
  ],
  declarations: [
    VRNCaptureModal,
  ],
  providers: [
    AppComponent,
  ],
})
export class VRNCaptureModalModule {
}
