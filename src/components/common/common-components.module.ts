import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '@shared/pipes/pipes.module';

import { SignaturePadModule } from 'angular2-signaturepad';
import { SignatureAreaComponent } from '@components/common/signature-area/signature-area';
import {
  HealthDeclarationSignedComponent,
} from '@components/common/health-declaration-signed/health-declaration-signed';
import { IncompleteTestsBanner } from '@components/common/incomplete-tests-banner/incomplete-tests-banner';
import { ModalAlertTitleComponent } from '@components/common/modal-alert-title/modal-alert-title';
import { ModalReturnButtonComponent } from '@components/common/modal-return-button/modal-return-button';
import { PracticeModeBanner } from '@components/common/practice-mode-banner/practice-mode-banner';
import { LockScreenIndicator } from '@components/common/screen-lock-indicator/lock-screen-indicator';
import { SeriousFaultBadgeComponent } from '@components/common/serious-fault-badge/serious-fault-badge';
import { TickIndicatorComponent } from '@components/common/tick-indicator/tick-indicator';
import { TransmissionComponent } from '@components/common/transmission/transmission';
import { SignatureComponent } from '@components/common/signature/signature';
import { TransmissionDisplayComponent } from '@components/common/transmission-display/transmission-display';
import { ActivityCodeComponent } from '@components/common/activity-code/activity-code';
import { CPCDebriefCardComponent } from '@components/common/cpc-debrief-card/cpc-debrief-card';
import { ModalActivityCodeListComponent } from '@components/common/modal-activity-code-list/modal-activity-code-list';
import { TerminateTestModalModule } from '@components/common/terminate-test-modal/terminate-test-modal.module';
import { Adi3DebriefCard } from '@components/common/adi3-debrief-card/adi3-debrief-card';
import { Adi3DebriefCardBox } from '@components/common/adi3-debrief-card-box/adi3-debrief-card-box';
import { TypeaheadDropdownComponent } from './typeahead-dropdown/typeahead-dropdown';
import { WarningBannerComponent } from './warning-banner/warning-banner';
import { TabsComponent } from './tabs/tabs';
import { TabComponent } from './tab/tab';
import { OfflineBannerComponent } from './offline-banner/offline-banner';
import { ErrorMessageComponent } from './error-message/error-message';
import { DisplayAddressComponent } from './display-address/display-address';
import { DataRowCustomComponent } from './data-row-custom/data-row-custom';
import { DataRowComponent } from './data-row/data-row';
import { BikeCategoryTypeComponent } from './bike-category-type/bike-category-type';
import { CandidateSectionComponent } from './candidate-section/candidate-section';
import { DangerousFaultBadgeComponent } from './dangerous-fault-badge/dangerous-fault-badge';
import { DrivingFaultsBadgeComponent } from './driving-faults-badge/driving-faults-badge';
import { EndTestLinkComponent } from './end-test-link/end-test-link';
import { MesBackButtonComponent } from './mes-back-button/mes-back-button';
import { VRNCaptureModalModule } from './vrn-capture-modal/vrn-capture-modal.module';

@NgModule({
  declarations: [
    SignatureAreaComponent,
    BikeCategoryTypeComponent,
    CandidateSectionComponent,
    DangerousFaultBadgeComponent,
    DataRowComponent,
    DataRowCustomComponent,
    DisplayAddressComponent,
    DrivingFaultsBadgeComponent,
    EndTestLinkComponent,
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
    ModalActivityCodeListComponent,
    PracticeModeBanner,
    LockScreenIndicator,
    SeriousFaultBadgeComponent,
    TickIndicatorComponent,
    TransmissionComponent,
    MesBackButtonComponent,
    SignatureComponent,
    ActivityCodeComponent,
    TransmissionDisplayComponent,
    CPCDebriefCardComponent,
    Adi3DebriefCard,
    Adi3DebriefCardBox,
  ],
  imports: [
    SignaturePadModule,
    CommonModule,
    IonicModule,
    NgbTypeaheadModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    VRNCaptureModalModule,
    PipesModule,
    TerminateTestModalModule,
  ],
  exports: [
    SignatureAreaComponent,
    BikeCategoryTypeComponent,
    CandidateSectionComponent,
    DangerousFaultBadgeComponent,
    DataRowComponent,
    DataRowCustomComponent,
    DisplayAddressComponent,
    DrivingFaultsBadgeComponent,
    EndTestLinkComponent,
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
    ModalActivityCodeListComponent,
    PracticeModeBanner,
    LockScreenIndicator,
    SeriousFaultBadgeComponent,
    TickIndicatorComponent,
    TransmissionComponent,
    MesBackButtonComponent,
    SignatureComponent,
    TranslateModule,
    ActivityCodeComponent,
    TransmissionDisplayComponent,
    CPCDebriefCardComponent,
    Adi3DebriefCard,
    Adi3DebriefCardBox,
  ],
})
export class ComponentsModule { }
