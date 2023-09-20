import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { MockComponent } from 'ng-mocks';
import { DataRowCustomComponent } from '@components/common/data-row-custom/data-row-custom';
import { DataRowComponent } from '@components/common/data-row/data-row';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { InappropriateUseBannerComponent } from '@components/common/inappropriate-use-banner/inappropriate-use-banner';
import { TestDetailsModel } from '../test-details-card.model';
import { CandidateDetails, TestDetailsCardComponent } from '../test-details-card';

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

    describe('additionalReqsIsPopulated', () => {
      it('should return false for an empty array', () => {
        const specialNeedsArray = [];
        expect(component.additionalReqsIsPopulated(specialNeedsArray)).toBeFalsy();
      });

      it('should return false for an array that has None in it', () => {
        const specialNeedsArray = ['None'];
        expect(component.additionalReqsIsPopulated(specialNeedsArray)).toBeFalsy();
      });

      it('should return true for a populated array', () => {
        const specialNeedsArray = ['special need 1', 'special need 2'];
        expect(component.additionalReqsIsPopulated(specialNeedsArray)).toBeTruthy();
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

    describe('showAttemptNumber', () => {
      it('should return true if an attempt number is present', () => {
        component.candidateDetails = { attemptNumber: 1 } as CandidateDetails;
        expect(component.showAttemptNumber()).toEqual(true);
      });
      it('should return false if an attempt number is not present', () => {
        component.candidateDetails = { prn: 1 } as CandidateDetails;
        expect(component.showAttemptNumber()).toEqual(false);
      });
    });
    describe('showPrn', () => {
      it('should return true if prn is present', () => {
        component.candidateDetails = { prn: 1 } as CandidateDetails;
        expect(component.showPrn()).toEqual(true);
      });
      it('should return false if prn is not present', () => {
        component.candidateDetails = { attemptNumber: 1 } as CandidateDetails;
        expect(component.showPrn()).toEqual(false);
      });
    });
  });
});
