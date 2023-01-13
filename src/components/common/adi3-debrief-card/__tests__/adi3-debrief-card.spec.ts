import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Adi3DebriefCard } from '@components/common/adi3-debrief-card/adi3-debrief-card';

describe('DangerousFaultBadgeComponent', () => {
  let fixture: ComponentFixture<Adi3DebriefCard>;
  let component: Adi3DebriefCard;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        Adi3DebriefCard,
      ],
    });

    fixture = TestBed.createComponent(Adi3DebriefCard);
    component = fixture.componentInstance;
  }));

  describe('displayGradeDescription', () => {
    it('should "Sufficient competence demonstrated to permit '
        + 'entry to the Register of Approved Driving Instructors" if grade is "B"', () => {
      component.grade = 'B';
      expect(component.displayGradeDescription()).toBe('Sufficient competence demonstrated to '
          + 'permit entry to the Register of Approved Driving Instructors');
    });
    it('should "A high overall standard of instruction demonstrated" if grade is "A"', () => {
      component.grade = 'A';
      expect(component.displayGradeDescription()).toBe('A high overall standard of instruction demonstrated');
    });
    it('should "Unsatisfactory Performance" if grade sets the switch to default', () => {
      component.grade = 'test';
      expect(component.displayGradeDescription()).toBe('Unsatisfactory Performance');
    });
  });
});
