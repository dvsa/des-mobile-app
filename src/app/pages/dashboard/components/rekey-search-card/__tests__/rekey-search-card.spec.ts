import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { configureTestSuite } from 'ng-bullet';
import { RekeySearchCardComponent } from '../rekey-search-card';
import { REKEY_SEARCH_PAGE } from '../../../../page-names.constants';

describe('RekeySearchCard ', () => {
  let component: RekeySearchCardComponent;
  let fixture: ComponentFixture<RekeySearchCardComponent>;
  let router: Router;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [RekeySearchCardComponent],
      providers: [
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(RekeySearchCardComponent);
    component = fixture.componentInstance;
  }));

  // @TODO: MES-6912 tests will be reinstated when rekey search is implemented
  xdescribe('Class', () => {
    describe('navigateToRekey', () => {
      it('should trigger navigation to rekey', () => {
        component.navigateToRekeySearch();

        expect(router.navigate).toHaveBeenCalledWith([REKEY_SEARCH_PAGE]);
      });
    });
  });
});
