import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppModule } from '@app/app.module';
import { MockComponent } from 'ng-mocks';
import { PracticeModeBanner } from '@components/common/practice-mode-banner/practice-mode-banner';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { PostDebriefHoldingPage } from '../post-debrief-holding.page';

describe('PostDebriefHoldingPage', () => {
  let fixture: ComponentFixture<PostDebriefHoldingPage>;
  let component: PostDebriefHoldingPage;
  let routeByCat: RouteByCategoryProvider;

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
      ],
      providers: [
        {
          provide: RouteByCategoryProvider,
          useClass: RouteByCategoryProviderMock,
        },
      ],
    });

    fixture = TestBed.createComponent(PostDebriefHoldingPage);
    component = fixture.componentInstance;
    routeByCat = TestBed.inject(RouteByCategoryProvider);
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
        expect(routeByCat.navigateToPage)
          .toHaveBeenCalledWith(
            TestFlowPageNames.NON_PASS_FINALISATION_PAGE,
          );
      }));
    });
  });
});
