import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, Platform } from '@ionic/angular';
import { PlatformMock } from 'ionic-mocks';
import { Router } from '@angular/router';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { FakeJournalPage } from '../fake-journal.page';

describe('FakeJournalPage', () => {
  let component: FakeJournalPage;
  let fixture: ComponentFixture<FakeJournalPage>;
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FakeJournalPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: Platform, useFactory: () => PlatformMock.instance() },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FakeJournalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should setup test', () => {
    expect(component).toBeTruthy();
  });
});
