import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FitMarkerBannerComponent } from '@components/common/fit-marker-banner/fit-marker-banner';
import { IonicModule } from '@ionic/angular';

describe('FitMarkerBannerComponent', () => {
  let fixture: ComponentFixture<FitMarkerBannerComponent>;
  let component: FitMarkerBannerComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FitMarkerBannerComponent],
      imports: [IonicModule],
    });

    fixture = TestBed.createComponent(FitMarkerBannerComponent);
    component = fixture.componentInstance;
  }));

  describe('DOM', () => {
    it('should create', () => {
      expect(component).toBeDefined();
    });
  });
});
