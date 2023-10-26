import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '@components/common/common-components.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ValidCertificateComponent } from '@pages/communication/components/valid-certificate/valid-certificate';
import { ProvidedEmailComponent } from './provided-email/provided-email';
import { NewEmailComponent } from './new-email/new-email';
import { PostalAddressComponent } from './postal-address/postal-address';
import { PrivacyNoticeComponent } from './privacy-notice/privacy-notice';
import { DirectivesModule } from '@directives/directives.module';

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
    IonicModule,
    TranslateModule,
    ReactiveFormsModule,
    DirectivesModule,
  ],
  exports: [
    ProvidedEmailComponent,
    NewEmailComponent,
    PostalAddressComponent,
    PrivacyNoticeComponent,
    ValidCertificateComponent,
  ],
})
export class CommunicationComponentsModule { }
