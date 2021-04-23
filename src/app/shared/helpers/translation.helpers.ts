import { TranslateService } from '@ngx-translate/core';
import { Language } from '@store/tests/communication-preferences/communication-preferences.model';

export const configureI18N = (language: Language, translateService: TranslateService) : void => {
  if (language === Language.CYMRAEG) {
    translateService.use('cy');
  } else {
    translateService.use('en');
  }
};
