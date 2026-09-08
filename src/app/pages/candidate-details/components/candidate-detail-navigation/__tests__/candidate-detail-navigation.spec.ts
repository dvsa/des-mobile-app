import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { CandidateDetailNavigationComponent } from '@pages/candidate-details/components/candidate-detail-navigation/candidate-detail-navigation';

describe('CandidateDetailNavigationComponent', () => {
  let fixture: ComponentFixture<CandidateDetailNavigationComponent>;
  let component: CandidateDetailNavigationComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CandidateDetailNavigationComponent],
      imports: [IonicModule],
    });

    fixture = TestBed.createComponent(CandidateDetailNavigationComponent);
    component = fixture.componentInstance;
  });

  describe('onPreviousCandidateClick', () => {
    it('should emit previousCandidateClicked', () => {
      spyOn(component.previousCandidateClicked, 'emit');
      component.onPreviousCandidateClick();
      expect(component.previousCandidateClicked.emit).toHaveBeenCalled();
    });
  });
  describe('onNextCandidateClick', () => {
    it('should emit nextCandidateClicked', () => {
      spyOn(component.nextCandidateClicked, 'emit');
      component.onNextCandidateClick();
      expect(component.nextCandidateClicked.emit).toHaveBeenCalled();
    });
  });

  describe('isToday', () => {
    beforeEach(() => {
      jasmine.clock().install();
      jasmine.clock().mockDate(new Date('2026-09-02T10:00:00'));
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });

    it('should return true when date is the current day', () => {
      component.date = '2026-09-02T00:01:00';

      expect(component.isToday()).toBeTrue();
    });

    it('should return false when date is not the current day', () => {
      component.date = '2026-09-03T00:01:00';

      expect(component.isToday()).toBeFalse();
    });

    it('should return false when date is invalid', () => {
      component.date = 'not-a-valid-date';

      expect(component.isToday()).toBeFalse();
    });
  });
});
