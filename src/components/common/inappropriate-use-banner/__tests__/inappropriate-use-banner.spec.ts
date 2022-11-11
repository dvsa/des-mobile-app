import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { InappropriateUseBannerComponent } from '@components/common/inappropriate-use-banner/inappropriate-use-banner';

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
