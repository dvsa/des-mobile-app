import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  IonicModule, LoadingController, ModalController, NavParams, Platform,
} from '@ionic/angular';

import { Router } from '@angular/router';
import {
  // MockStore,
  provideMockStore,
} from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoadingControllerMock, PlatformMock } from 'ionic-mocks';
import { ComponentFactoryResolver } from '@angular/core';
import { configureTestSuite } from 'ng-bullet';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { JournalPage } from './journal.page';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { AuthenticationProviderMock } from '../../providers/authentication/__mocks__/authentication.mock';
import { SlotSelectorProvider } from '../../providers/slot-selector/slot-selector';
import { DateTimeProvider } from '../../providers/date-time/date-time';
import { DateTimeProviderMock } from '../../providers/date-time/__mocks__/date-time.mock';
import { AppConfigProvider } from '../../providers/app-config/app-config';
import { AppConfigProviderMock } from '../../providers/app-config/__mocks__/app-config.mock';
import { AppComponent } from '../../app.component';
import { ModalControllerMock } from '../../../../mock/ionic-mocks/modal-controller.mock';
import { MockAppComponent } from '../../__mocks__/app.component.mock';
import { JournalComponentsModule } from './components/journal-components.module';
import { TestSlotComponentsModule } from '../../../components/test-slot/test-slot-components.module';
import { ErrorPageModule } from '../error-page/error.module';
import { JournalPageRoutingModule } from './journal-routing.module';
import { ComponentsModule } from '../../../components/common/common-components.module';
import { CandidateDetailsPageModule } from '../candidate-details/candidate-details.module';

fdescribe('JournalPage', () => {
  let component: JournalPage;
  let fixture: ComponentFixture<JournalPage>;
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
  // let store$: MockStore;
  const initialState = {};
  // let slotSelector: SlotSelectorProvider;
  // let appConfigProvider: AppConfigProvider;
  // let authenticationProvider: AuthenticationProvider;

  const mockNavParams = {
    // get: (param: string) => {
    //   const data = {};
    // },
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [JournalPage],
      imports: [
        JournalComponentsModule,
        TestSlotComponentsModule,
        IonicModule,
        ErrorPageModule,
        JournalPageRoutingModule,
        CommonModule,
        ComponentsModule,
        CandidateDetailsPageModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: Platform, useFactory: () => PlatformMock.instance() },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: Router, useValue: routerSpy },
        { provide: ModalController, useClass: ModalControllerMock },
        { provide: NavParams, useValue: mockNavParams },
        { provide: LoadingController, useFactory: () => LoadingControllerMock.instance() },
        provideMockStore({ initialState }),
        SlotSelectorProvider,
        ComponentFactoryResolver,
        { provide: DateTimeProvider, useClass: DateTimeProviderMock },
        { provide: AppConfigProvider, useClass: AppConfigProviderMock },
        { provide: AppComponent, useClass: MockAppComponent },
      ],
    });
  });

  beforeEach(async(() => {

    fixture = TestBed.createComponent(JournalPage);
    component = fixture.componentInstance;
    component.subscription = new Subscription();
    // store$ = TestBed.inject(MockStore);
    fixture.detectChanges();

    // appConfigProvider = TestBed.inject(AppConfigProvider);
    // authenticationProvider = TestBed.inject(AuthenticationProvider);
  }));

  describe('Should be correctly configured', () => {
    it('should be created successfully', () => {
      expect(component instanceof JournalPage).toBeTruthy();
    });
  });

});
