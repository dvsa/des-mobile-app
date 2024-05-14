import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TestRecoveredBannerComponent } from '@components/common/test-recovered-banner/test-recovered-banner';

describe('TestRecoveredBannerComponent', () => {
  let component: TestRecoveredBannerComponent;
  let fixture: ComponentFixture<TestRecoveredBannerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TestRecoveredBannerComponent],
      imports: [IonicModule],
    });

    fixture = TestBed.createComponent(TestRecoveredBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
