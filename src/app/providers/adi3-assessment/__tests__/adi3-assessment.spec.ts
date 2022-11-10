import { TestBed } from '@angular/core/testing';
import { ADI3AssessmentProvider } from '@providers/adi3-assessment/adi3-assessment';

describe('ADI3AssessmentProvider', () => {
  let adi3AssessmentProvider: ADI3AssessmentProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ADI3AssessmentProvider,
      ],
    });

    adi3AssessmentProvider = TestBed.inject(ADI3AssessmentProvider);
  });

  describe('countScoreIfTouched', () => {
    it('should return `-` if validateTestReport returns 0', async () => {
      spyOn(adi3AssessmentProvider, 'validateTestReport').and.returnValue(0);
      const result = await adi3AssessmentProvider.countScoreIfTouched({});
      expect(result).toBe('-');
    });

    it('should return `score` if validateTestReport returns other then 0', async () => {
      spyOn(adi3AssessmentProvider, 'validateTestReport').and.returnValue(1);
      spyOn(adi3AssessmentProvider, 'getTotalAssessmentScore').and.returnValue(3);
      const result = await adi3AssessmentProvider.countScoreIfTouched({});
      expect(result).toBe(3);
    });
  });

});
