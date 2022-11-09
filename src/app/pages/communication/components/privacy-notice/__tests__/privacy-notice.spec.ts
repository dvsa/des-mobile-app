import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { translateServiceMock } from '@shared/helpers/__mocks__/translate.mock';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { PrivacyNoticeComponent } from '../privacy-notice';

fdescribe('PrivacyNoticeComponent', () => {
  let fixture: ComponentFixture<PrivacyNoticeComponent>;
  let component: PrivacyNoticeComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        PrivacyNoticeComponent,
      ],
      imports: [
        IonicModule,
        TranslateModule,
      ],
      providers: [
        { provide: TranslateService, useValue: translateServiceMock },
      ],
    });

    fixture = TestBed.createComponent(PrivacyNoticeComponent);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    it('should compile', () => {
      expect(component).toBeDefined();
    });

    describe('categorySpecificTestContext', () => {
      it('return adi when adi', () => {
        expect(component.categorySpecificTestContext(TestCategory.ADI3)).toEqual('ADI');
      });

      it('return common.riding when when bike test', () => {
        expect(component.categorySpecificTestContext(TestCategory.EUA1M1)).toEqual('common.riding');
        expect(component.categorySpecificTestContext(TestCategory.EUA1M2)).toEqual('common.riding');
        expect(component.categorySpecificTestContext(TestCategory.EUA2M1)).toEqual('common.riding');
        expect(component.categorySpecificTestContext(TestCategory.EUA2M2)).toEqual('common.riding');
        expect(component.categorySpecificTestContext(TestCategory.EUAM1)).toEqual('common.riding');
        expect(component.categorySpecificTestContext(TestCategory.EUAM2)).toEqual('common.riding');
        expect(component.categorySpecificTestContext(TestCategory.EUAMM1)).toEqual('common.riding');
        expect(component.categorySpecificTestContext(TestCategory.EUAMM2)).toEqual('common.riding');
      });

      it('return common.driving when not adi or bike test', () => {
        expect(component.categorySpecificTestContext(TestCategory.B)).toEqual('common.driving');
      });
    });
  });

});
