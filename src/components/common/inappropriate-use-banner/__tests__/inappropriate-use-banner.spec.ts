import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InappropriateUseBannerComponent } from '@components/common/inappropriate-use-banner/inappropriate-use-banner';

describe('InappropriateUseBannerComponent', () => {
  let component: InappropriateUseBannerComponent;
  let fixture: ComponentFixture<InappropriateUseBannerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InappropriateUseBannerComponent],
    });

    fixture = TestBed.createComponent(InappropriateUseBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
