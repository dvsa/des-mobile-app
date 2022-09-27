import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { configureI18N } from '@shared/helpers/translation.helpers';
import { Language } from '@store/tests/communication-preferences/communication-preferences.model';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

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
      case TestCategory.ADI3:
      case TestCategory.SC:
        return 'ADI';
      case TestCategory.EUA1M1:
      case TestCategory.EUA1M2:
      case TestCategory.EUA2M1:
      case TestCategory.EUA2M2:
      case TestCategory.EUAM1:
      case TestCategory.EUAM2:
      case TestCategory.EUAMM1:
      case TestCategory.EUAMM2:
        return 'common.riding';
      default:
        return 'common.driving';
    }
  }

}
