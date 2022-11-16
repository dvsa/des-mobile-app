import { TestBed, waitForAsync, ComponentFixture } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { By } from '@angular/platform-browser';
import { DangerBannerComponent } from '../danger-banner';

describe('DangerBanner', () => {
  let fixture: ComponentFixture<DangerBannerComponent>;
  let component: DangerBannerComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DangerBannerComponent],
      imports: [
        IonicModule,
      ],
    });

    fixture = TestBed.createComponent(DangerBannerComponent);
    component = fixture.componentInstance;
  }));

  describe('DOM', () => {
    it('should display the danger message', () => {
      const dangerText = 'This is the danger text';
      component.dangerText = dangerText;

      fixture.detectChanges();
      const rendered = fixture.debugElement.query(By.css('span#danger_text')).nativeElement.innerHTML;
      expect(rendered).toBe(dangerText);
    });
  });
});
