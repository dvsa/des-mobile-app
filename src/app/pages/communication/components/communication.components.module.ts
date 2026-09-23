import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';
import { DirectivesModule } from '@directives/directives.module';
import { TranslatePipe } from '@ngx-translate/core';
import { ValidCertificateComponent } from '@pages/communication/components/valid-certificate/valid-certificate';
import { NewEmailComponent } from './new-email/new-email';
import { PostalAddressComponent } from './postal-address/postal-address';
import { PrivacyNoticeComponent } from './privacy-notice/privacy-notice';
import { ProvidedEmailComponent } from './provided-email/provided-email';

import { IonicComponentsModule } from '@shared/modules/ionic-components.module';
@NgModule({
  declarations: [
    ProvidedEmailComponent,
    NewEmailComponent,
    PostalAddressComponent,
    PrivacyNoticeComponent,
    ValidCertificateComponent,
  ],
  imports: [
    IonicComponentsModule,
    CommonModule,
    ComponentsModule,
    ReactiveFormsModule,
    DirectivesModule,
    TranslatePipe,
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
