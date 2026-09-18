import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FitMarkerBannerComponent } from '@components/common/fit-marker-banner/fit-marker-banner';

describe('FitMarkerBannerComponent', () => {
  let fixture: ComponentFixture<FitMarkerBannerComponent>;
  let component: FitMarkerBannerComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FitMarkerBannerComponent],
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
