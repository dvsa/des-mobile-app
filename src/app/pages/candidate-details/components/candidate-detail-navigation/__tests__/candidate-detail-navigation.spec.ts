import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CandidateDetailNavigationComponent } from '@pages/candidate-details/components/candidate-detail-navigation/candidate-detail-navigation';

describe('CandidateDetailNavigationComponent', () => {
  let fixture: ComponentFixture<CandidateDetailNavigationComponent>;
  let component: CandidateDetailNavigationComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CandidateDetailNavigationComponent],
    });

    fixture = TestBed.createComponent(CandidateDetailNavigationComponent);
    component = fixture.componentInstance;
  });

  describe('onPreviousCandidateClick', () => {
    it('should emit previousCandidateClicked', () => {
      vi.spyOn(component.previousCandidateClicked, 'emit').mockReturnValue(undefined);
      component.onPreviousCandidateClick();
      expect(component.previousCandidateClicked.emit).toHaveBeenCalled();
    });
  });
  describe('onNextCandidateClick', () => {
    it('should emit nextCandidateClicked', () => {
      vi.spyOn(component.nextCandidateClicked, 'emit').mockReturnValue(undefined);
      component.onNextCandidateClick();
      expect(component.nextCandidateClicked.emit).toHaveBeenCalled();
    });
  });

  describe('isToday', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-09-02T10:00:00'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return true when date is the current day', () => {
      component.date = '2026-09-02T00:01:00';

      expect(component.isToday()).toBe(true);
    });

    it('should return false when date is not the current day', () => {
      component.date = '2026-09-03T00:01:00';

      expect(component.isToday()).toBe(false);
    });

    it('should return false when date is invalid', () => {
      component.date = 'not-a-valid-date';

      expect(component.isToday()).toBe(false);
    });
  });
});
