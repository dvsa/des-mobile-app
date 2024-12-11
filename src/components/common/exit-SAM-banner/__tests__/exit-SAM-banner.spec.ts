import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { IonicModule } from '@ionic/angular';
import { StoreModule } from '@ngrx/store';

import { AppLauncher } from '@capacitor/app-launcher';
import { ExitSAMBannerComponent } from '@components/common/exit-SAM-banner/exit-SAM-banner';

describe('ExitSAMBannerComponent', () => {
  let fixture: ComponentFixture<ExitSAMBannerComponent>;
  let component: ExitSAMBannerComponent;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ExitSAMBannerComponent],
      imports: [
        IonicModule,
        StoreModule.forRoot({
          tests: () => ({
            currentTest: { testCategory: TestCategory.B },
            testStatus: {},
            startedTests: {},
          }),
        }),
      ],
    });

    fixture = TestBed.createComponent(ExitSAMBannerComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    describe('disableSAMAndExit', () => {
      it('should take the user to microsoft teams', async () => {
        spyOn(AppLauncher, 'openUrl');
        await component.disableSAMAndExit();
        expect(AppLauncher.openUrl).toHaveBeenCalled();
      });
    });
  });
});
