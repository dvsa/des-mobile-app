import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';
import { DirectivesModule } from '@directives/directives.module';
import { IonCol, IonGrid, IonIcon, IonInput, IonRow } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { ValidCertificateComponent } from '@pages/communication/components/valid-certificate/valid-certificate';
import { NewEmailComponent } from './new-email/new-email';
import { PostalAddressComponent } from './postal-address/postal-address';
import { PrivacyNoticeComponent } from './privacy-notice/privacy-notice';
import { ProvidedEmailComponent } from './provided-email/provided-email';

@NgModule({
  declarations: [
    ProvidedEmailComponent,
    NewEmailComponent,
    PostalAddressComponent,
    PrivacyNoticeComponent,
    ValidCertificateComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    ReactiveFormsModule,
    DirectivesModule,
    IonRow,
    TranslatePipe,
    IonCol,
    IonInput,
    IonIcon,
    IonGrid,
  ],
  exports: [
    ProvidedEmailComponent,
    NewEmailComponent,
    PostalAddressComponent,
    PrivacyNoticeComponent,
    ValidCertificateComponent,
  ],
})
export class CommunicationComponentsModule {}
