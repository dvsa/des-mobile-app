import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { PersonalCommitmentSlotComponent } from '@pages/journal/components/personal-commitment/personal-commitment';

describe('PersonalCommitmentSlotComponent', () => {
  let fixture: ComponentFixture<PersonalCommitmentSlotComponent>;
  let component: PersonalCommitmentSlotComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PersonalCommitmentSlotComponent],
      imports: [
        IonicModule,
      ],
    });

    fixture = TestBed.createComponent(PersonalCommitmentSlotComponent);
    component = fixture.componentInstance;
  }));

  describe('transformSlotTime', () => {
    it('should return the string passed if the index is 0', () => {
      expect(component.transformSlotTime('test', 0)).toBe('test');
    });
    it('should return null if the index is not 0', () => {
      expect(component.transformSlotTime('test', 1)).toBe(null);
    });
  });
  describe('formatActivityCode', () => {
    it('should return "0" if activityCode is null', () => {
      expect(component.formatActivityCode(null)).toBe('0');
    });
    it('should return 40 if activityCode is not null', () => {
      expect(component.formatActivityCode('0000000000040')).toBe('40');
    });
  });
});
