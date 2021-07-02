import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { configureTestSuite } from 'ng-bullet';
import { SeriousFaultBadgeComponent } from '../serious-fault-badge';

describe('SeriousFaultBadgeComponenet', () => {
  let fixture: ComponentFixture<SeriousFaultBadgeComponent>;
  let component: SeriousFaultBadgeComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        SeriousFaultBadgeComponent,
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(SeriousFaultBadgeComponent);
    component = fixture.componentInstance;
  }));

  describe('DOM', () => {
    it('should display badge if showBadge is true', () => {
      component.showBadge = true;

      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('.background'))).toBeDefined();
    });
    it('should not display badge if showBadge is false', () => {
      component.showBadge = false;

      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('.background'))).toBeNull();
    });
  });
});
