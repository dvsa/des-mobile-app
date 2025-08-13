import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { IonicModule } from '@ionic/angular';
import { StoreModule } from '@ngrx/store';

import { RouterMock } from '@mocks/angular-mocks/router-mock';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { CategoryWhitelistProvider } from '@providers/category-whitelist/category-whitelist';
import { DeletePracticeModeTests } from '@store/tests/tests.actions';
import { PracticeModeBanner } from '../practice-mode-banner';

describe('PracticeModeBanner', () => {
  let fixture: ComponentFixture<PracticeModeBanner>;
  let component: PracticeModeBanner;
  let router: Router;
  let store$: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PracticeModeBanner],
      imports: [
        IonicModule,
        RouterModule,
        StoreModule.forRoot({
          tests: () => ({
            currentTest: { testCategory: TestCategory.B },
            testStatus: {},
            startedTests: {},
          }),
        }),
      ],
      providers: [
        {
          provide: Router,
          useClass: RouterMock,
        },
        CategoryWhitelistProvider,
        provideMockStore({}),
      ],
    });

    fixture = TestBed.createComponent(PracticeModeBanner);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    store$ = TestBed.inject(MockStore);
    spyOn(store$, 'dispatch');
  });

  describe('exitPracticeMode', () => {
    it('should take the user back to the root page', async () => {
      spyOn(router, 'navigate');
      await component.exitPracticeMode();
      expect(router.navigate).toHaveBeenCalled();
    });

    it('should dispatch practice mode clear', async () => {
      await component.exitPracticeMode();
      expect(store$.dispatch).toHaveBeenCalledWith(DeletePracticeModeTests());
    });
  });
});
