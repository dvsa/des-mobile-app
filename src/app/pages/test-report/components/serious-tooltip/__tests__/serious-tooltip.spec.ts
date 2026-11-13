import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { SeriousTooltipComponent } from '../serious-tooltip';

describe('SeriousTooltipComponenet', () => {
  let fixture: ComponentFixture<SeriousTooltipComponent>;
  let component: SeriousTooltipComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SeriousTooltipComponent],
    });

    fixture = TestBed.createComponent(SeriousTooltipComponent);
    component = fixture.componentInstance;
  });

  describe('Class', () => {
    it('should create', () => {
      expect(component).toBeDefined();
    });
  });
});
