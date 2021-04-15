import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import * as pageConstants from '@pages/page-names.constants';
import { JournalPage } from '@pages/journal/journal.page';

describe('RouteByCategoryProvider', () => {

  let provider: RouteByCategoryProvider;
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(
          [
            { path: 'journal', component: JournalPage },
          ],
        ),
      ],
      providers: [
        RouteByCategoryProvider,
        { provide: Router, useValue: routerSpy },
      ],
    });
  });

  beforeEach(() => {
    provider = TestBed.inject(RouteByCategoryProvider);
  });

  describe('navigateToPage', () => {
    it('should call router.navigate', async () => {
      provider.router.config = [];
      spyOn(pageConstants, 'getPageNameByCategoryAndKey').and.returnValue('WaitingRoomToCarCatBPage');
      spyOn(provider, 'getPageAliasByCategory').and.returnValue('cat-b');
      spyOn(provider, 'getBasePagePathByCategory').and.returnValue('waiting-room-to-car');
      await provider.navigateToPage('WAITING_ROOM_TO_CAR_PAGE', TestCategory.B);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['WaitingRoomToCarCatBPage']);
    });
  });

  describe('getPageAliasByCategory', () => {
    it('should return correct path based upon category', () => {
      expect(provider.getPageAliasByCategory(TestCategory.ADI2)).toEqual('cat-adi-part2');
    });
  });

  describe('getBasePagePathByCategory', () => {
    it('should return correct path based upon page', () => {
      expect(provider.getBasePagePathByCategory('WAITING_ROOM_TO_CAR_PAGE')).toEqual('waiting-room-to-car');
    });
  });
});
