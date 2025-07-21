import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AppModule } from '@app/app.module';
import { IonicModule } from '@ionic/angular';
import { ScDebriefCard } from '@pages/view-test-result/components/sc-debrief-card/sc-debrief-card';

describe('ScDebriefCard', () => {
  let fixture: ComponentFixture<ScDebriefCard>;
  let component: ScDebriefCard;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ScDebriefCard],
      imports: [IonicModule, AppModule],
    });

    fixture = TestBed.createComponent(ScDebriefCard);
    component = fixture.componentInstance;
  }));

  describe('findDifferenceInTime', () => {
    it('should find the correct difference in minutes between two times', () => {
      const diff = component.findDifferenceInTime('2024-06-01T09:00:00Z', '2024-06-01T09:30:00Z');
      expect(diff).toBe(30);
    });
  });
});
