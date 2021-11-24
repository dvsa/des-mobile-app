import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, Platform } from '@ionic/angular';
import { PlatformMock } from 'ionic-mocks';
import { Router } from '@angular/router';
import { configureTestSuite } from 'ng-bullet';
import { MockComponent } from 'ng-mocks';

import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { FakeTestSlotComponent } from '@pages/fake-journal/components/fake-test-slot/fake-test-slot';
import { PracticeModeBanner } from '@components/common/practice-mode-banner/practice-mode-banner';
import { LocationComponent } from '@components/test-slot/location/location';
import { FakeJournalPage } from '../fake-journal.page';

describe('FakeJournalPage', () => {
  let component: FakeJournalPage;
  let fixture: ComponentFixture<FakeJournalPage>;
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        FakeJournalPage,
        MockComponent(FakeTestSlotComponent),
        MockComponent(PracticeModeBanner),
        MockComponent(LocationComponent),
      ],
      imports: [
        IonicModule,
      ],
      providers: [
        { provide: Platform, useFactory: () => PlatformMock.instance() },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: Router, useValue: routerSpy },
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(FakeJournalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should setup test', () => {
    expect(component).toBeTruthy();
  });
});
