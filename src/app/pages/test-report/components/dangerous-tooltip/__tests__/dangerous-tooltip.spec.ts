import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { DangerousTooltipComponent } from '../dangerous-tooltip';

describe('DangerousTooltipComponent', () => {
  let fixture: ComponentFixture<DangerousTooltipComponent>;
  let component: DangerousTooltipComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DangerousTooltipComponent],
    });

    fixture = TestBed.createComponent(DangerousTooltipComponent);
    component = fixture.componentInstance;
  });

  describe('Class', () => {
    it('should create', () => {
      expect(component).toBeDefined();
    });
  });
});
