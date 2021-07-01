import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { By } from '@angular/platform-browser';
import { WarningBannerComponent } from '@components/common/warning-banner/warning-banner';
import { IonicModule } from '@ionic/angular';
import { LicenceProvidedWarningBannerComponent } from '../licence-provided-warning-banner';

describe('LicenceProvidedWarningBannerComponent', () => {
  let fixture: ComponentFixture<LicenceProvidedWarningBannerComponent>;
  let component: LicenceProvidedWarningBannerComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        LicenceProvidedWarningBannerComponent,
        WarningBannerComponent,
      ],
      imports: [
        IonicModule,
      ],
      providers: [
        LicenceProvidedWarningBannerComponent,
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(LicenceProvidedWarningBannerComponent);
    component = fixture.componentInstance;
  }));

  describe('DOM', () => {
    it('should display correct message when licence provided', () => {
      component.licenceProvided = true;
      fixture.detectChanges();
      const rendered = fixture.debugElement.query(By.css('span#warning_text')).nativeElement.innerHTML;
      expect(rendered).toBe(component.yesText);
    });
    it('should display correct message when licence NOT provided', () => {
      component.licenceProvided = false;
      fixture.detectChanges();
      const rendered = fixture.debugElement.query(By.css('span#warning_text')).nativeElement.innerHTML;
      expect(rendered).toBe(component.noText);
    });
  });
});
