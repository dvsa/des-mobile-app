import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { configureTestSuite } from 'ng-bullet';
import { RouterMock } from '@mocks/angular-mocks/router-mock';
import { DELEGATED_REKEY_SEARCH_PAGE } from '@pages/page-names.constants';
import { IonicModule } from '@ionic/angular';
import { DelegatedSearchCardComponent } from '../delegated-rekey-card';

describe('DelegatedSearchCardComponent', () => {
  let component: DelegatedSearchCardComponent;
  let fixture: ComponentFixture<DelegatedSearchCardComponent>;
  let router: Router;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [DelegatedSearchCardComponent],
      imports: [IonicModule],
      providers: [
        { provide: Router, useClass: RouterMock },
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(DelegatedSearchCardComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  }));

  describe('Class', () => {
    describe('navigateToDelegatedRekeySearch', () => {
      it('should trigger navigation to delegated rekey', async () => {
        await component.navigateToDelegatedRekeySearch();
        expect(router.navigate).toHaveBeenCalledWith([DELEGATED_REKEY_SEARCH_PAGE]);
      });
    });
  });
});
