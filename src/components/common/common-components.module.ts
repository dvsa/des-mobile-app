import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '@shared/pipes/pipes.module';

import { AngularSignaturePadModule } from '@almothafar/angular-signature-pad';
import { ActivityCodeComponent } from '@components/common/activity-code/activity-code';
import { Adi3DebriefCardBox } from '@components/common/adi3-debrief-card-box/adi3-debrief-card-box';
import { Adi3DebriefCard } from '@components/common/adi3-debrief-card/adi3-debrief-card';
import { CPCDebriefCardComponent } from '@components/common/cpc-debrief-card/cpc-debrief-card';
import { DateTimeInputComponent } from '@components/common/datetime-input/date-time-input.component';
import { HealthDeclarationSignedComponent } from '@components/common/health-declaration-signed/health-declaration-signed';
import { IncompleteTestsBanner } from '@components/common/incomplete-tests-banner/incomplete-tests-banner';
import { ModalActivityCodeListComponent } from '@components/common/modal-activity-code-list/modal-activity-code-list';
import { ModalAlertTitleComponent } from '@components/common/modal-alert-title/modal-alert-title';
import { ModalReturnButtonComponent } from '@components/common/modal-return-button/modal-return-button';
import { PracticeModeBanner } from '@components/common/practice-mode-banner/practice-mode-banner';
import { LockScreenIndicator } from '@components/common/screen-lock-indicator/lock-screen-indicator';
import { SearchablePicklistModal } from '@components/common/searchable-picklist-modal/searchable-picklist-modal';
import { SearchablePicklistComponentWrapper } from '@components/common/searchable-picklist-wrapper/searchable-picklist-wrapper';
import { SeriousFaultBadgeComponent } from '@components/common/serious-fault-badge/serious-fault-badge';
import { SignatureAreaComponent } from '@components/common/signature-area/signature-area';
import { SignatureComponent } from '@components/common/signature/signature';
import { TerminateTestModalModule } from '@components/common/terminate-test-modal/terminate-test-modal.module';
import { TickIndicatorComponent } from '@components/common/tick-indicator/tick-indicator';
import { TransmissionDisplayComponent } from '@components/common/transmission-display/transmission-display';
import { TransmissionComponent } from '@components/common/transmission/transmission';

import { ChartComponent } from '@components/common/chart/chart';
import { DataGridComponent } from '@components/common/data-grid/data-grid';
import { TestRecoveredBannerComponent } from '@components/common/test-recovered-banner/test-recovered-banner';
import { DirectivesModule } from '@directives/directives.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { BikeCategoryTypeComponent } from './bike-category-type/bike-category-type';
import { CandidateSectionComponent } from './candidate-section/candidate-section';
import { DangerousFaultBadgeComponent } from './dangerous-fault-badge/dangerous-fault-badge';
import { DataRowCustomComponent } from './data-row-custom/data-row-custom';
import { DataRowComponent } from './data-row/data-row';
import { DisplayAddressComponent } from './display-address/display-address';
import { DrivingFaultsBadgeComponent } from './driving-faults-badge/driving-faults-badge';
import { EndTestLinkComponent } from './end-test-link/end-test-link';
import { ErrorMessageComponent } from './error-message/error-message';
import { OfflineBannerComponent } from './offline-banner/offline-banner';
import { TabComponent } from './tab/tab';
import { TabsComponent } from './tabs/tabs';
import { VRNCaptureModalModule } from './vrn-capture-modal/vrn-capture-modal.module';
import { WarningBannerComponent } from './warning-banner/warning-banner';
import { TimePickerComponent } from '@components/common/time-picker/time-picker.component';
import {ChangeStartEndTimeModal} from '@components/common/change-start-end-time-modal/change-start-end-time-modal';

@NgModule({
  declarations: [
    TimePickerComponent,
    ChangeStartEndTimeModal,
    DateTimeInputComponent,
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
    HealthDeclarationSignedComponent,
    IncompleteTestsBanner,
    ModalAlertTitleComponent,
    ModalReturnButtonComponent,
    ModalActivityCodeListComponent,
    PracticeModeBanner,
    LockScreenIndicator,
    SeriousFaultBadgeComponent,
    TestRecoveredBannerComponent,
    TickIndicatorComponent,
    TransmissionComponent,
    SignatureComponent,
    ActivityCodeComponent,
    TransmissionDisplayComponent,
    CPCDebriefCardComponent,
    Adi3DebriefCard,
    Adi3DebriefCardBox,
    SearchablePicklistComponentWrapper,
    SearchablePicklistModal,
    DataGridComponent,
    ChartComponent,
    DataRowComponent,
  ],
  imports: [
    AngularSignaturePadModule,
    CommonModule,
    IonicModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    VRNCaptureModalModule,
    PipesModule,
    TerminateTestModalModule,
    NgOptimizedImage,
    DirectivesModule,
    NgApexchartsModule,
  ],
  exports: [
    DateTimeInputComponent,
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
    HealthDeclarationSignedComponent,
    IncompleteTestsBanner,
    ModalAlertTitleComponent,
    ModalReturnButtonComponent,
    ModalActivityCodeListComponent,
    PracticeModeBanner,
    LockScreenIndicator,
    SeriousFaultBadgeComponent,
    TestRecoveredBannerComponent,
    TickIndicatorComponent,
    TransmissionComponent,
    SignatureComponent,
    TranslateModule,
    ActivityCodeComponent,
    TransmissionDisplayComponent,
    CPCDebriefCardComponent,
    Adi3DebriefCard,
    Adi3DebriefCardBox,
    SearchablePicklistComponentWrapper,
    SearchablePicklistModal,
    DataGridComponent,
    ChartComponent,
    DataRowComponent,
  ],
})
export class ComponentsModule {}
