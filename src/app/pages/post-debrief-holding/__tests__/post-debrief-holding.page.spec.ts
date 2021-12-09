import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { Platform } from '@ionic/angular';

import { PlatformMock } from 'ionic-mocks';
import { Router } from '@angular/router';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { Store, StoreModule } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { RouterTestingModule } from '@angular/router/testing';
import { AppModule } from '@app/app.module';
import { MockComponent } from 'ng-mocks';
import { PracticeModeBanner } from '@components/common/practice-mode-banner/practice-mode-banner';
import { configureTestSuite } from 'ng-bullet';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { PostDebriefHoldingPage } from '../post-debrief-holding.page';

describe('PostDebriefHoldingPage', () => {
  let fixture: ComponentFixture<PostDebriefHoldingPage>;
  let component: PostDebriefHoldingPage;
  let store$: Store<StoreModel>;
  let routeByCat: RouteByCategoryProvider;
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        PostDebriefHoldingPage,
        MockComponent(PracticeModeBanner),
      ],
      imports: [
        RouterTestingModule.withRoutes([]),
        AppModule,
        StoreModule.forFeature('tests', () => ({})),
      ],
      providers: [
        { provide: Platform, useFactory: () => PlatformMock.instance() },
        { provide: Router, useValue: routerSpy },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: RouteByCategoryProvider, useClass: RouteByCategoryProviderMock },
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(PostDebriefHoldingPage);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    routeByCat = TestBed.inject(RouteByCategoryProvider);
    spyOn(store$, 'dispatch');
  }));

  describe('Class', () => {
    it('should create component', () => {
      expect(component)
        .toBeTruthy();
    });

    describe('continueButton', () => {
      it('should call navigateToPage function', fakeAsync(async () => {
        spyOn(routeByCat, 'navigateToPage');
        await component.continueButton();
        tick();
        expect(routeByCat.navigateToPage).toHaveBeenCalledWith(
          TestFlowPageNames.NON_PASS_FINALISATION_PAGE,
        );
      }));
    });
  });
});
