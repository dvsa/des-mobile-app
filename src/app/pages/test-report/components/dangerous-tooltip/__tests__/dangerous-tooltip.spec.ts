import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { DangerousTooltipComponent } from '../dangerous-tooltip';
import { configureTestSuite } from 'ng-bullet';

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

  beforeEach(async(() => {
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
