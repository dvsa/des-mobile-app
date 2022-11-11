import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { MockComponent } from 'ng-mocks';
import { DataRowCustomComponent } from '@components/common/data-row-custom/data-row-custom';
import { DataRowComponent } from '@components/common/data-row/data-row';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { InappropriateUseBannerComponent } from '@components/common/inappropriate-use-banner/inappropriate-use-banner';
import { TestDetailsModel } from '../test-details-card.model';
import { TestDetailsCardComponent } from '../test-details-card';

describe('TestDetailsCardComponent', () => {
  let fixture: ComponentFixture<TestDetailsCardComponent>;
  let component: TestDetailsCardComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestDetailsCardComponent,
        MockComponent(DataRowComponent),
        MockComponent(DataRowCustomComponent),
        MockComponent(InappropriateUseBannerComponent),
      ],
      imports: [
        IonicModule,
      ],
    });

    fixture = TestBed.createComponent(TestDetailsCardComponent);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    it('should create', () => {
      expect(component).toBeDefined();
    });

    describe('specialNeedsIsPopulated', () => {
      it('should return false for an empty array', () => {
        const specialNeedsArray = [];
        expect(component.specialNeedsIsPopulated(specialNeedsArray)).toBeFalsy();
      });

      it('should return false for an array that has None in it', () => {
        const specialNeedsArray = ['None'];
        expect(component.specialNeedsIsPopulated(specialNeedsArray)).toBeFalsy();
      });

      it('should return true for a populated array', () => {
        const specialNeedsArray = ['special need 1', 'special need 2'];
        expect(component.specialNeedsIsPopulated(specialNeedsArray)).toBeTruthy();
      });
    });

    describe('showFullCatHeld', () => {
      it('should return true if it is a +E category', () => {
        component.data = {
          category: TestCategory.CE,
        } as TestDetailsModel;
        expect(component.showFullCatHeld()).toBeTruthy();
      });

      it('should return false if it is not a +E category', () => {
        component.data = {
          category: TestCategory.C,
        } as TestDetailsModel;
        expect(component.showFullCatHeld()).toBeFalsy();
      });
    });
  });
});
