import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { SeriousTooltipComponent } from '../serious-tooltip';
import { configureTestSuite } from 'ng-bullet';

describe('SeriousTooltipComponenet', () => {
  let fixture: ComponentFixture<SeriousTooltipComponent>;
  let component: SeriousTooltipComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        SeriousTooltipComponent,
      ],
    });
  });

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SeriousTooltipComponent);
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
