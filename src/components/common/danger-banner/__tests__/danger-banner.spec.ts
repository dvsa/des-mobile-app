import { TestBed, waitForAsync, ComponentFixture } from '@angular/core/testing';
import { IonicModule, Config } from '@ionic/angular';
import { ConfigMock } from 'ionic-mocks';
import { By } from '@angular/platform-browser';
import { configureTestSuite } from 'ng-bullet';
import { DangerBannerComponent } from '../danger-banner';

describe('WarningBanner', () => {
  let fixture: ComponentFixture<DangerBannerComponent>;
  let component: DangerBannerComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [DangerBannerComponent],
      imports: [
        IonicModule,
      ],
      providers: [
        { provide: Config, useFactory: () => ConfigMock.instance() },
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(DangerBannerComponent);
    component = fixture.componentInstance;
  }));

  describe('DOM', () => {
    it('should display the warning message', () => {
      const dangerText = 'This is the warning text';
      component.dangerText = dangerText;

      fixture.detectChanges();
      const rendered = fixture.debugElement.query(By.css('span#danger_text')).nativeElement.innerHTML;
      expect(rendered).toBe(dangerText);
    });
  });
});
