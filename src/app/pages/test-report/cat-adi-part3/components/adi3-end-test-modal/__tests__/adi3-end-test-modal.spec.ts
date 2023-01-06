import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavParams } from '@ionic/angular';
import {
  ReactiveFormsModule,
} from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { Adi3EndTestModal } from '@pages/test-report/cat-adi-part3/components/adi3-end-test-modal/adi3-end-test-modal';
import { ActivityCodes } from '@shared/models/activity-codes';
import { ADI3AssessmentProvider } from '@providers/adi3-assessment/adi3-assessment';
import { ModalEvent } from '../../../../test-report.constants';

describe('Adi3EndTestModal', () => {
  let fixture: ComponentFixture<Adi3EndTestModal>;
  let component: Adi3EndTestModal;

  const mockNavParams = {
    get: (param: string) => {
      const data = {
        testData: { totalScore: 10 },
        testResult: { activityCode: '1', grade: 'grade' },
        totalScore: 10,
        feedback: 'feedback',
        isValidDashboard: false,
        isTestReportPopulated: true,
        riskToPublicSafety: false,
      };
      return data[param];
    },
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        IonicModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: ADI3AssessmentProvider, useClass: ADI3AssessmentProvider },
        { provide: NavParams, useValue: mockNavParams },
        provideMockStore({ ...{} }),
      ],
    });

    fixture = TestBed.createComponent(Adi3EndTestModal);
    component = fixture.componentInstance;
  }));

  describe('getOutcomeIcon', () => {
    it('should return the fail image if the outcome is a fail', () => {
      component.testResult.activityCode = ActivityCodes.FAIL;
      expect(component.getOutcomeIcon()).toBe('assets/imgs/redWrongAnswer.png');
    });
    it('should return the pass image if the outcome is not a fail', () => {
      component.testResult.activityCode = ActivityCodes.PASS;
      expect(component.getOutcomeIcon()).toBe('assets/imgs/greenCorrectAnswer.png');
    });
  });

  describe('onCancel', () => {
    it('should call dismiss with ModalEvent.CANCEL', () => {
      spyOn(component.modalCtrl, 'dismiss').and.returnValue(Promise.resolve(true));
      component.onCancel();

      expect(component.modalCtrl.dismiss).toHaveBeenCalledWith(ModalEvent.CANCEL);
    });
  });

  describe('ngOnInit', () => {
    it('should allocate variables correctly', () => {
      component.ngOnInit();

      expect(component.testData).toEqual({ totalScore: 10 });
      expect(component.testResult).toEqual({ activityCode: '1', grade: 'grade' });
      expect(component.totalScore).toBe(10);
      expect(component.feedback).toBe('feedback');
      expect(component.isValidDashboard).toBe(false);
      expect(component.isTestReportPopulated).toBe(true);
      expect(component.riskToPublicSafety).toBe(false);
    });
  });

  describe('onContinue', () => {
    it('should call dismiss with ModalEvent.CANCEL', () => {
      spyOn(component.modalCtrl, 'dismiss').and.returnValue(Promise.resolve(true));
      component.onContinue();

      expect(component.modalCtrl.dismiss).toHaveBeenCalledWith(ModalEvent.CONTINUE);
    });
  });

  describe('onTerminate', () => {
    it('should call dismiss with ModalEvent.CANCEL', () => {
      spyOn(component.modalCtrl, 'dismiss').and.returnValue(Promise.resolve(true));
      component.onTerminate();

      expect(component.modalCtrl.dismiss).toHaveBeenCalledWith(ModalEvent.TERMINATE);
    });
  });

  describe('getTestResultClass', () => {
    it('should return test-result-terminated-label if both'
        + ' isTestReportPopulated and riskToPublicSafety are false', () => {
      component.isTestReportPopulated = false;
      component.riskToPublicSafety = false;

      expect(component.getTestResultClass()).toBe('test-result-terminated-label');
    });
    it('should return test-result-terminated-label if both'
        + ' isTestReportPopulated and riskToPublicSafety are true', () => {
      component.isTestReportPopulated = true;
      component.riskToPublicSafety = true;

      expect(component.getTestResultClass()).toBe('test-result-terminated-label');
    });
    it('should return test-result-fail-label if'
        + ' isTestReportPopulated is true, riskToPublicSafety is false and activityCode is FAIL', () => {
      component.isTestReportPopulated = true;
      component.riskToPublicSafety = false;
      component.testResult.activityCode = ActivityCodes.FAIL;

      expect(component.getTestResultClass()).toBe('test-result-fail-label');
    });
    it('should return test-result-pass-label if'
        + ' isTestReportPopulated is true, riskToPublicSafety is false and activityCode is not FAIL', () => {
      component.isTestReportPopulated = true;
      component.riskToPublicSafety = false;
      component.testResult.activityCode = ActivityCodes.PASS;

      expect(component.getTestResultClass()).toBe('test-result-pass-label');
    });
  });

  describe('getTestResultLabel', () => {
    it('should return No Result if isTestReportPopulated is false', () => {
      component.isTestReportPopulated = false;

      expect(component.getTestResultLabel()).toBe('No Result');
    });
    it('should return Terminated if isTestReportPopulated is true '
        + 'and riskToPublicSafety is true', () => {
      component.isTestReportPopulated = true;
      component.riskToPublicSafety = true;

      expect(component.getTestResultLabel()).toBe('Terminated');
    });
    it('should return Unsuccessful if isTestReportPopulated is true, '
        + 'riskToPublicSafety is false and testResult.activityCode is FAIL', () => {
      component.isTestReportPopulated = true;
      component.riskToPublicSafety = false;
      component.testResult.activityCode = ActivityCodes.FAIL;

      expect(component.getTestResultLabel()).toBe('Unsuccessful');
    });
    it('should return Passed - Grade A if isTestReportPopulated is true, '
        + 'riskToPublicSafety is false, testResult.activityCode is not FAIL and testResult.grade is A', () => {
      component.isTestReportPopulated = true;
      component.riskToPublicSafety = false;
      component.testResult.activityCode = ActivityCodes.PASS;
      component.testResult.grade = 'A';

      expect(component.getTestResultLabel()).toBe('Passed - Grade A');
    });
    it('should return Passed - Grade B if isTestReportPopulated is true, '
        + 'riskToPublicSafety is false, '
        + 'testResult.activityCode is not FAIL and testResult.grade is not A', () => {
      component.isTestReportPopulated = true;
      component.riskToPublicSafety = false;
      component.testResult.activityCode = ActivityCodes.PASS;
      component.testResult.grade = 'B';

      expect(component.getTestResultLabel()).toBe('Passed - Grade B');
    });
  });
});
