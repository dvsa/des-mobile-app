import { TestBed } from '@angular/core/testing';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { Router } from '@angular/router';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { CAT_B, TestFlowPageNames } from '@pages/page-names.constants';
import { RouterMock } from '@mocks/angular-mocks/router-mock';

describe('RouteByCategoryProvider', () => {
  let provider: RouteByCategoryProvider;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RouteByCategoryProvider,
        {
          provide: Router,
          useClass: RouterMock,
        },
      ],
    });

    provider = TestBed.inject(RouteByCategoryProvider);
    router = TestBed.inject(Router);
  });

  describe('navigateToPage', () => {
    it('should call router navigate', async () => {
      await provider.navigateToPage(TestFlowPageNames.WAITING_ROOM_TO_CAR_PAGE, TestCategory.B);
      expect(router.navigate)
        .toHaveBeenCalledWith([CAT_B.WAITING_ROOM_TO_CAR_PAGE], {});
    });
  });
});
