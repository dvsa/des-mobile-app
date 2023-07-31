import { TestBed } from '@angular/core/testing';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { Router } from '@angular/router';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { TestFlowPageNames } from '@pages/page-names.constants';

xdescribe('RouteByCategoryProvider', () => {
  let provider: RouteByCategoryProvider;
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        RouteByCategoryProvider,
        {
          provide: Router,
          useValue: routerSpy,
        },
      ],
    });

    provider = TestBed.inject(RouteByCategoryProvider);
  });

  xdescribe('navigateToPage', () => {
    it('should call router.navigate', async () => {
      provider.router.config = [];
      await provider.navigateToPage(TestFlowPageNames.WAITING_ROOM_TO_CAR_PAGE, TestCategory.B);
      expect(routerSpy.navigate)
        .toHaveBeenCalledWith(['WaitingRoomToCarCatBPage'], {});
    });
  });
});
