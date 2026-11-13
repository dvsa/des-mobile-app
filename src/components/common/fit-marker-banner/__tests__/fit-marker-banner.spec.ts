import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FitMarkerBannerComponent } from '@components/common/fit-marker-banner/fit-marker-banner';
import { beforeEach, describe, expect, it } from 'vitest';

describe('FitMarkerBannerComponent', () => {
  let fixture: ComponentFixture<FitMarkerBannerComponent>;
  let component: FitMarkerBannerComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FitMarkerBannerComponent],
    });

    fixture = TestBed.createComponent(FitMarkerBannerComponent);
    component = fixture.componentInstance;
  });

  describe('DOM', () => {
    it('should create', () => {
      expect(component).toBeDefined();
    });
  });
});
