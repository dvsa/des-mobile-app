import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { DangerousTooltipComponent } from '../dangerous-tooltip';

describe('DangerousTooltipComponent', () => {
  let fixture: ComponentFixture<DangerousTooltipComponent>;
  let component: DangerousTooltipComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        DangerousTooltipComponent,
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(DangerousTooltipComponent);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    it('should create', () => {
      expect(component).toBeDefined();
    });
  });

  describe('DOM', () => {

  });
});
