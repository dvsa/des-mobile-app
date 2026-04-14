import { TestBed } from '@angular/core/testing';
import { AppInfoProvider } from '../app-info';

describe('AppInfoProvider', () => {
  let appInfoProvider: AppInfoProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppInfoProvider],
    });

    appInfoProvider = TestBed.inject(AppInfoProvider);
  });

  it('should return version number (Observable)', (done) => {
    appInfoProvider.getVersionNumber().subscribe((version) => {
      expect(version).toBe('1.2.3');
      done();
    });
  });

  it('should return full version number (Promise)', async () => {
    const version = await appInfoProvider.getFullVersionNumber();
    expect(version).toBe('1.2.3');
  });
});
