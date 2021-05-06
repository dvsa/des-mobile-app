import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '@components/common/common-components.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ProvidedEmailComponent } from './provided-email/provided-email';
import { NewEmailComponent } from './new-email/new-email';
import { PostalAddressComponent } from './postal-address/postal-address';
import { PrivacyNoticeComponent } from './privacy-notice/privacy-notice';

@NgModule({
  declarations: [
    ProvidedEmailComponent,
    NewEmailComponent,
    PostalAddressComponent,
    PrivacyNoticeComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    IonicModule,
    TranslateModule,
    ReactiveFormsModule,
  ],
  exports: [
    ProvidedEmailComponent,
    NewEmailComponent,
    PostalAddressComponent,
    PrivacyNoticeComponent,
  ],
})
export class CommunicationComponentsModule { }
