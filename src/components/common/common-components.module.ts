import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { SignaturePadModule } from 'angular2-signaturepad';
import { SignatureAreaComponent } from '@components/common/signature-area/signature-area';
import { HealthDeclarationSignedComponent }
  from '@components/common/health-declaration-signed/health-declaration-signed';
import { IncompleteTestsBanner } from '@components/common/incomplete-tests-banner/incomplete-tests-banner';
import { ModalAlertTitleComponent } from '@components/common/modal-alert-title/modal-alert-title';
import { ModalReturnButtonComponent } from '@components/common/modal-return-button/modal-return-button';
import { PracticeModeBanner } from '@components/common/practice-mode-banner/practice-mode-banner';
import { LockScreenIndicator } from '@components/common/screen-lock-indicator/lock-screen-indicator';
import { SeriousFaultBadgeComponent } from '@components/common/serious-fault-badge/serious-fault-badge';
import { TickIndicatorComponent } from '@components/common/tick-indicator/tick-indicator';
import { TransmissionComponent } from '@components/common/transmission/transmission';
import { TranslateModule } from '@ngx-translate/core';
import { TypeaheadDropdownComponent } from './typeahead-dropdown/typeahead-dropdown';
import { WarningBannerComponent } from './warning-banner/warning-banner';
import { TabsComponent } from './tabs/tabs';
import { TabComponent } from './tab/tab';
import { OfflineBannerComponent } from './offline-banner/offline-banner';
import { ErrorMessageComponent } from './error-message/error-message';
import { DisplayAddressComponent } from './display-address/display-address';
import { DataRowCustomComponent } from './data-row-custom/data-row-custom';
import { DataRowComponent } from './data-row/data-row';

@NgModule({
  declarations: [
    SignatureAreaComponent,
    DataRowComponent,
    DataRowCustomComponent,
    DisplayAddressComponent,
    ErrorMessageComponent,
    OfflineBannerComponent,
    TabComponent,
    TabsComponent,
    WarningBannerComponent,
    TypeaheadDropdownComponent,
    HealthDeclarationSignedComponent,
    IncompleteTestsBanner,
    ModalAlertTitleComponent,
    ModalReturnButtonComponent,
    PracticeModeBanner,
    LockScreenIndicator,
    SeriousFaultBadgeComponent,
    TickIndicatorComponent,
    TransmissionComponent,
  ],
  imports: [
    SignaturePadModule,
    CommonModule,
    IonicModule,
    NgbTypeaheadModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
  ],
  exports: [
    SignatureAreaComponent,
    DataRowComponent,
    DataRowCustomComponent,
    DisplayAddressComponent,
    ErrorMessageComponent,
    OfflineBannerComponent,
    TabComponent,
    TabsComponent,
    WarningBannerComponent,
    TypeaheadDropdownComponent,
    HealthDeclarationSignedComponent,
    IncompleteTestsBanner,
    ModalAlertTitleComponent,
    ModalReturnButtonComponent,
    PracticeModeBanner,
    LockScreenIndicator,
    SeriousFaultBadgeComponent,
    TickIndicatorComponent,
    TransmissionComponent,
  ],
})
export class ComponentsModule { }
