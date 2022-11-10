import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { SeriousTooltipComponent } from '../serious-tooltip';

describe('SeriousTooltipComponenet', () => {
  let fixture: ComponentFixture<SeriousTooltipComponent>;
  let component: SeriousTooltipComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        SeriousTooltipComponent,
      ],
    });

    fixture = TestBed.createComponent(SeriousTooltipComponent);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    it('should create', () => {
      expect(component).toBeDefined();
    });
  });
});
