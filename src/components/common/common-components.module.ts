import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { DataRowComponent } from './data-row/data-row';
import { DataRowCustomComponent } from './data-row-custom/data-row-custom';
import { DisplayAddressComponent } from './display-address/display-address';
import { ErrorMessageComponent } from './error-message/error-message';
import { OfflineBannerComponent } from './offline-banner/offline-banner';
import { TabComponent } from './tab/tab';
import { TabsComponent } from './tabs/tabs';
import { WarningBannerComponent } from './warning-banner/warning-banner';
import { TypeaheadDropdownComponent } from './typeahead-dropdown/typeahead-dropdown';

@NgModule({
  declarations: [
    DataRowComponent,
    DataRowCustomComponent,
    DisplayAddressComponent,
    ErrorMessageComponent,
    OfflineBannerComponent,
    TabComponent,
    TabsComponent,
    WarningBannerComponent,
    TypeaheadDropdownComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    NgbTypeaheadModule,
    FormsModule,
  ],
  exports: [
    DataRowComponent,
    DataRowCustomComponent,
    DisplayAddressComponent,
    ErrorMessageComponent,
    OfflineBannerComponent,
    TabComponent,
    TabsComponent,
    WarningBannerComponent,
    TypeaheadDropdownComponent,
  ],
})
export class ComponentsModule { }
