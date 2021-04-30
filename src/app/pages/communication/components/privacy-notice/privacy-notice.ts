import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { configureI18N } from '@shared/helpers/translation.helpers';
import { Language } from '@store/tests/communication-preferences/communication-preferences.model';

@Component({
  selector: 'privacy-notice',
  templateUrl: 'privacy-notice.html',
})
export class PrivacyNoticeComponent implements OnInit {

  @Input()
  language: Language;

  @Input()
  isRider: boolean = false;

  constructor(private translate: TranslateService) { }

  ngOnInit() : void {
    configureI18N(this.language, this.translate);
  }

}
