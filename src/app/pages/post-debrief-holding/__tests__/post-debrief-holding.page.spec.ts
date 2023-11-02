import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';

import { Router } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { RouterTestingModule } from '@angular/router/testing';
import { AppModule } from '@app/app.module';
import { MockComponent } from 'ng-mocks';
import { PracticeModeBanner } from '@components/common/practice-mode-banner/practice-mode-banner';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { RouterMock } from '@mocks/angular-mocks/router-mock';
import { PostDebriefHoldingPage } from '../post-debrief-holding.page';

describe('PostDebriefHoldingPage', () => {
  let fixture: ComponentFixture<PostDebriefHoldingPage>;
  let component: PostDebriefHoldingPage;
  let router: Router;

  beforeEach(waitForAsync(() => {
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
        {
          provide: Router,
          useClass: RouterMock,
        },
      ],
    });

    fixture = TestBed.createComponent(PostDebriefHoldingPage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  }));

  describe('Class', () => {
    it('should create component', () => {
      expect(component)
        .toBeTruthy();
    });

    describe('continueButton', () => {
      it('should call navigateToPage function', fakeAsync(async () => {
        await component.continueButton();
        tick();
        expect(router.navigate)
          .toHaveBeenCalledWith([TestFlowPageNames.NON_PASS_FINALISATION_PAGE]);
      }));
    });
  });
});
