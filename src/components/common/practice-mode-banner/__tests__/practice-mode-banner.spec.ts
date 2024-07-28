import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { IonicModule } from '@ionic/angular';
import { StoreModule } from '@ngrx/store';

import { RouterMock } from '@mocks/angular-mocks/router-mock';
import { CategoryWhitelistProvider } from '@providers/category-whitelist/category-whitelist';
import { PracticeModeBanner } from '../practice-mode-banner';

describe('PracticeModeBanner', () => {
  let fixture: ComponentFixture<PracticeModeBanner>;
  let component: PracticeModeBanner;
  let router: Router;

  beforeEach(waitForAsync(() => {
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
      ],
    });

    fixture = TestBed.createComponent(PracticeModeBanner);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    describe('exitPracticeMode', () => {
      it('should take the user back to the root page', async () => {
        spyOn(router, 'navigate');
        await component.exitPracticeMode();
        expect(router.navigate).toHaveBeenCalled();
      });
    });
  });
});
