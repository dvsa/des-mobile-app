import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, Platform } from '@ionic/angular';
import { PlatformMock } from '@mocks/index.mock';
import { Router } from '@angular/router';
import { MockComponent } from 'ng-mocks';

import { JournalNavigationComponent } from '@pages/journal/components/journal-navigation/journal-navigation';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { PracticeModeBanner } from '@components/common/practice-mode-banner/practice-mode-banner';
import { LocationComponent } from '@components/test-slot/location/location';
import { StoreModel } from '@shared/models/store.model';
import { Store } from '@ngrx/store';
import { FakeJournalDidEnter } from '@pages/fake-journal/fake-journal.actions';
import { provideMockStore } from '@ngrx/store/testing';
import { TestSlotComponent } from '@components/test-slot/test-slot/test-slot';
import { OrientationMonitorProvider } from '@providers/orientation-monitor/orientation-monitor.provider';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { FakeJournalPage } from '../fake-journal.page';

describe('FakeJournalPage', () => {
  let component: FakeJournalPage;
  let fixture: ComponentFixture<FakeJournalPage>;
  let store$: Store<StoreModel>;
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        FakeJournalPage,
        MockComponent(PracticeModeBanner),
        MockComponent(LocationComponent),
        MockComponent(TestSlotComponent),
        MockComponent(JournalNavigationComponent),
      ],
      imports: [
        IonicModule,
      ],
      providers: [
        OrientationMonitorProvider,
        {
          provide: Platform,
          useClass: PlatformMock,
        },
        {
          provide: AuthenticationProvider,
          useClass: AuthenticationProviderMock,
        },
        {
          provide: DateTimeProvider,
          useClass: DateTimeProviderMock,
        },
        {
          provide: Router,
          useValue: routerSpy,
        },
        provideMockStore({ initialState: {} }),
      ],
    });

    fixture = TestBed.createComponent(FakeJournalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    store$ = TestBed.inject(Store);
    spyOn(store$, 'dispatch');
  }));

  it('should setup test', () => {
    expect(component)
      .toBeTruthy();
  });

  describe('ionViewDidEnter', () => {
    it('should dispatch an action', () => {
      component.ionViewDidEnter();
      expect(store$.dispatch)
        .toHaveBeenCalledWith(FakeJournalDidEnter());
    });
  });

  describe('ionViewWillLeave', () => {
    it('should call tearDownListener', () => {
      spyOn(component.orientationMonitorProvider, 'tearDownListener');
      component.ionViewWillLeave();
      expect(component.orientationMonitorProvider.tearDownListener)
        .toHaveBeenCalled();
    });
  });

  describe('ionViewWillEnter', () => {
    it('should call monitorOrientation', () => {
      spyOn(component.orientationMonitorProvider, 'monitorOrientation');
      component.ionViewWillEnter();
      expect(component.orientationMonitorProvider.monitorOrientation)
        .toHaveBeenCalled();
    });
  });
});
