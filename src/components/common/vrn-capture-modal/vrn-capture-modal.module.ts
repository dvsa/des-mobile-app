import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AppComponent } from '@app/app.component';
import { HeaderComponentModule } from '@components/common/header-component/header-component.module';
import { VRNCaptureModal } from './vrn-capture-modal';

@NgModule({
  imports: [
    HeaderComponentModule,
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
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
