import { provideHttpClient } from '@angular/common/http';
import { EnvironmentProviders, Provider } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import welshTranslations from '@assets/i18n/cy.json';
import englishTranslations from '@assets/i18n/en.json';
import { ModalController, NavController, Platform } from '@ionic/angular';
import {
  ActivatedRouteMock,
  ModalControllerMock,
  NavControllerMock,
  PlatformMock,
  RouterMock,
} from '@mocks/index.mock';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateLoader, provideTranslateService } from '@ngx-translate/core';
import { AccessibilityServiceMock } from '@providers/accessibility/__mocks__/accessibility-service.mock';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { DeviceProvider } from '@providers/device/device';
import { LogHelperMock } from '@providers/logs/__mocks__/logs-helper.mock';
import { LogHelper } from '@providers/logs/logs-helper';
import { of } from 'rxjs';

export function provideBasePageMocks(shouldProvideMockStore = true): (Provider | EnvironmentProviders)[] {
  return [
    ...provideTestTranslations(),
    { provide: Platform, useClass: PlatformMock },
    { provide: ModalController, useClass: ModalControllerMock },
    { provide: NavController, useClass: NavControllerMock },
    { provide: AccessibilityService, useClass: AccessibilityServiceMock },
    { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
    { provide: Router, useClass: RouterMock },
    { provide: ActivatedRoute, useClass: ActivatedRouteMock },
    { provide: AppConfigProvider, useClass: AppConfigProviderMock },
    { provide: DeviceProvider, useClass: DeviceProviderMock },
    { provide: LogHelper, useClass: LogHelperMock },
    shouldProvideMockStore ? provideMockStore({ ...{} }) : [],
  ];
}

export function provideTestTranslations(): (Provider | EnvironmentProviders)[] {
  return [
    provideHttpClient(),
    provideTranslateService({
      loader: { provide: TranslateLoader, useClass: TestTranslationLoader },
      fallbackLang: 'en',
      lang: 'en',
    }),
  ];
}

class TestTranslationLoader implements TranslateLoader {
  getTranslation(language: string) {
    if (language === 'en') return of(englishTranslations);
    if (language === 'cy') return of(welshTranslations);
    throw new Error(`Unsupported test translation language: ${language}`);
  }
}
