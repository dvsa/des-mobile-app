import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, Platform } from '@ionic/angular';
import { PlatformMock } from 'ionic-mocks';
import { Router } from '@angular/router';
import { configureTestSuite } from 'ng-bullet';
import { MockComponent } from 'ng-mocks';

import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { PracticeModeBanner } from '@components/common/practice-mode-banner/practice-mode-banner';
import { LocationComponent } from '@components/test-slot/location/location';
import { StoreModel } from '@shared/models/store.model';
import { Store } from '@ngrx/store';
import { FakeJournalDidEnter } from '@pages/fake-journal/fake-journal.actions';
import { provideMockStore } from '@ngrx/store/testing';
import { TestSlotComponent } from '@components/test-slot/test-slot/test-slot';
import { FakeJournalPage } from '../fake-journal.page';

describe('FakeJournalPage', () => {
  let component: FakeJournalPage;
  let fixture: ComponentFixture<FakeJournalPage>;
  let store$: Store<StoreModel>;
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        FakeJournalPage,
        MockComponent(PracticeModeBanner),
        MockComponent(LocationComponent),
        MockComponent(TestSlotComponent),
      ],
      imports: [
        IonicModule,
      ],
      providers: [
        { provide: Platform, useFactory: () => PlatformMock.instance() },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: Router, useValue: routerSpy },
        provideMockStore({ initialState: {} }),
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(FakeJournalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    store$ = TestBed.inject(Store);
    spyOn(store$, 'dispatch');
  }));

  it('should setup test', () => {
    expect(component).toBeTruthy();
  });

  describe('ionViewDidEnter', () => {
    it('should dispatch an action', () => {
      component.ionViewDidEnter();
      expect(store$.dispatch).toHaveBeenCalledWith(FakeJournalDidEnter());
    });
  });
});
