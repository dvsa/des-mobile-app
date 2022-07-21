import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { configureI18N } from '@shared/helpers/translation.helpers';
import { Language } from '@store/tests/communication-preferences/communication-preferences.model';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';

@Component({
  selector: 'privacy-notice',
  templateUrl: 'privacy-notice.html',
  styleUrls: ['./privacy-notice.scss'],
})
export class PrivacyNoticeComponent implements OnInit {

  @Input()
  language: Language;

  @Input()
  category: CategoryCode;

  constructor(private translate: TranslateService) { }

  ngOnInit() : void {
    configureI18N(this.language, this.translate);
  }

  categorySpecificTestContext(cat: CategoryCode): string {
    switch (cat) {
      case 'ADI3':
        return 'ADI';
      case 'EUA1M1':
      case 'EUA1M2':
      case 'EUA2M1':
      case 'EUA2M2':
      case 'EUAM1':
      case 'EUAM2':
      case 'EUAMM1':
      case 'EUAMM2':
        return 'common.riding';
      default:
        return 'common.driving';
    }
  }

}
