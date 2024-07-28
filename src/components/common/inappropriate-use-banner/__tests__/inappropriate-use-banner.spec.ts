import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { InappropriateUseBannerComponent } from '@components/common/inappropriate-use-banner/inappropriate-use-banner';
import { IonicModule } from '@ionic/angular';

describe('InappropriateUseBannerComponent', () => {
  let component: InappropriateUseBannerComponent;
  let fixture: ComponentFixture<InappropriateUseBannerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [InappropriateUseBannerComponent],
      imports: [IonicModule],
    });

    fixture = TestBed.createComponent(InappropriateUseBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
