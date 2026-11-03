import { provideHttpClient } from '@angular/common/http';
import { EnvironmentProviders, Provider } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MockAppComponent } from '@app/__mocks__/app.component.mock';
import { AppComponent } from '@app/app.component';
import { ModalController, NavController, Platform } from '@ionic/angular';
import {
  ActivatedRouteMock,
  ModalControllerMock,
  NavControllerMock,
  PlatformMock,
  RouterMock,
} from '@mocks/index.mock';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
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

export function provideBasePageMocks(): (Provider | EnvironmentProviders)[] {
  return [
    ...provideTestTranslations(),
    { provide: Platform, useClass: PlatformMock },
    { provide: ModalController, useClass: ModalControllerMock },
    { provide: NavController, useClass: NavControllerMock },
    { provide: AppComponent, useClass: MockAppComponent },
    { provide: AccessibilityService, useClass: AccessibilityServiceMock },
    { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
    { provide: Router, useClass: RouterMock },
    { provide: ActivatedRoute, useClass: ActivatedRouteMock },
    { provide: AppConfigProvider, useClass: AppConfigProviderMock },
    { provide: DeviceProvider, useClass: DeviceProviderMock },
    { provide: LogHelper, useClass: LogHelperMock },
  ];
}

export function provideTestTranslations(): (Provider | EnvironmentProviders)[] {
  return [
    provideHttpClient(),
    provideTranslateService({
      loader: provideTranslateHttpLoader({ prefix: 'assets/i18n/' }),
      fallbackLang: 'en',
      lang: 'en',
    }),
  ];
}
