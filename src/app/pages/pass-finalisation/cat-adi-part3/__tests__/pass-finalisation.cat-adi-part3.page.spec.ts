import {
  ComponentFixture, TestBed, waitForAsync,
} from '@angular/core/testing';
import { NavController, Platform, IonicModule } from '@ionic/angular';
import { NavControllerMock, PlatformMock } from 'ionic-mocks';
import { Router } from '@angular/router';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { Store } from '@ngrx/store';
import { configureTestSuite } from 'ng-bullet';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MockComponent } from 'ng-mocks';
import { PracticeModeBanner } from '@components/common/practice-mode-banner/practice-mode-banner';
import { DebriefWitnessedComponent } from '@components/test-finalisation/debrief-witnessed/debrief-witnessed';
import { FinalisationHeaderComponent } from '@components/test-finalisation/finalisation-header/finalisation-header';
import { RouterTestingModule } from '@angular/router/testing';
import { AppModule } from '@app/app.module';
import {
  FurtherDevelopmentComponent,
} from '@pages/pass-finalisation/cat-adi-part3/components/further-development/further-development.component';
import { StoreModel } from '@shared/models/store.model';
import {
  ReasonForNoAdviceGivenChanged,
  SeekFurtherDevelopmentChanged,
} from '@store/tests/test-data/cat-adi-part3/review/review.actions';
import { PassFinalisationCatADIPart3Page } from '../pass-finalisation.cat-adi-part3.page';

describe('PassFinalisation.CatAdiPart3.Page.HtmlPage', () => {
  let component: PassFinalisationCatADIPart3Page;
  let fixture: ComponentFixture<PassFinalisationCatADIPart3Page>;
  let store$: Store<StoreModel>;
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        PassFinalisationCatADIPart3Page,
        MockComponent(PracticeModeBanner),
        MockComponent(FinalisationHeaderComponent),
        MockComponent(DebriefWitnessedComponent),
        MockComponent(FurtherDevelopmentComponent),
      ],
      imports: [
        RouterTestingModule.withRoutes([]),
        IonicModule,
        AppModule,
      ],
      providers: [
        {
          provide: Platform,
          useFactory: () => PlatformMock.instance(),
        },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: Router, useValue: routerSpy },
        { provide: Store },
        { provide: NavController, useClass: NavControllerMock },
        OutcomeBehaviourMapProvider,
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(PassFinalisationCatADIPart3Page);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    spyOn(store$, 'dispatch');
  }));

  describe('class', () => {
    it('should create', () => {
      expect(component)
        .toBeTruthy();
    });

    describe('furtherDevelopmentChanged', () => {
      it('should dispatch SeekFurtherDevelopmentChanged using the parameter given ', () => {
        component.furtherDevelopmentChanged(true);
        expect(store$.dispatch)
          .toHaveBeenCalledWith(SeekFurtherDevelopmentChanged(true));
      });
    });

    describe('adviceReasonChanged', () => {
      it('should dispatch ReasonForNoAdviceGivenChanged using the parameter given ', () => {
        component.adviceReasonChanged('test');
        expect(store$.dispatch)
          .toHaveBeenCalledWith(ReasonForNoAdviceGivenChanged('test'));
      });
    });
  });
});
