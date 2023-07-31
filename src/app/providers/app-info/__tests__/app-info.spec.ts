import { TestBed } from '@angular/core/testing';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import { AppVersionMock } from '@mocks/ionic-mocks/app-version.mock';
import { take } from 'rxjs/operators';
import { AppInfoProvider } from '../app-info';

const APP_VERSION_NUMBER = '1.1.9';

describe('AppInfoProvider', () => {
  let appInfoProvider: AppInfoProvider;
  let appVersionMock: AppVersionMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AppInfoProvider,
        {
          provide: AppVersion,
          useClass: AppVersionMock,
        },
      ],
    });

    appInfoProvider = TestBed.inject(AppInfoProvider);
    appVersionMock = TestBed.inject(AppVersion);
    spyOn(appVersionMock, 'getVersionNumber')
      .and
      .returnValue(Promise.resolve(APP_VERSION_NUMBER));
  });

  describe('getVersionNumber', () => {
    it('should obtain the version number from app version native plugin', () => {
      appInfoProvider.getVersionNumber()
        .pipe(take(1))
        .subscribe();

      expect(appVersionMock.getVersionNumber)
        .toHaveBeenCalled();
    });

    it('should return version number into an observable', (done) => {
      appInfoProvider.getVersionNumber()
        .pipe(take(1))
        .subscribe((versionNumber) => {
          expect(versionNumber)
            .toBe(APP_VERSION_NUMBER);
          done();
        });
    });
  });
  describe('getMajorAndMinorVersionNumber', () => {
    it('should successfully extract the app version in the correct format', async () => {
      const result = await appInfoProvider.getMajorAndMinorVersionNumber();
      expect(result)
        .toEqual('1.1');
    });
  });
});
