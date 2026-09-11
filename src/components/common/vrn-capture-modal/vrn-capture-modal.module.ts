import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from '@app/app.component';
import { DirectivesModule } from '@directives/directives.module';
import { VRNCaptureModal } from './vrn-capture-modal';
import {IonButton, IonCard, IonCol, IonInput, IonRow, IonText} from '@ionic/angular';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DirectivesModule, IonText, IonButton, IonCol, IonRow, IonInput, IonCard],
  declarations: [VRNCaptureModal],
  providers: [AppComponent],
})
export class VRNCaptureModalModule {}
