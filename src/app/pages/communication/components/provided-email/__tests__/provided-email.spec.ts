import { waitForAsync, TestBed, ComponentFixture } from '@angular/core/testing';
import { UntypedFormGroup, UntypedFormControl, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { By } from '@angular/platform-browser';
import { TranslateModule, TranslateService, TranslateLoader } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { createTranslateLoader } from '@app/app.module';
import { ProvidedEmailComponent } from '../provided-email';

fdescribe('ProvidedEmailComponent', () => {
  let fixture: ComponentFixture<ProvidedEmailComponent>;
  let component: ProvidedEmailComponent;
  let translate: TranslateService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProvidedEmailComponent,
      ],
      imports: [
        IonicModule,
        HttpClientModule,
        ReactiveFormsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: createTranslateLoader,
            deps: [HttpClient],
          },
        }),
      ],
    });

    fixture = TestBed.createComponent(ProvidedEmailComponent);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({});
    component.formGroup.addControl('radioCtrl', new UntypedFormControl());
    component.shouldRender = true;
    component.isProvidedEmailAddressChosen = true;
    translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en');
  }));

  describe('DOM', () => {
    describe('i18n', () => {
      it('should render in English by default', (done) => {
        translate.use('en').subscribe(() => {
          fixture.detectChanges();
          expect(fixture.debugElement.query(By.css('.communication-text')).nativeElement.innerHTML.trim())
            .toBe('The following email address was used when booking the test:');
          expect(fixture.debugElement.query(By.css('#providedEmail + label')).nativeElement.innerHTML.trim())
            .toBe('By email (provided at time of booking)');
          done();
        });
      });

      it('should render in Welsh when its a Welsh test', (done) => {
        translate.use('cy').subscribe(() => {
          fixture.detectChanges();
          expect(fixture.debugElement.query(By.css('.communication-text')).nativeElement.innerHTML.trim())
            .toBe('Defnyddiwyd y cyfeiriad e-bost dilynol wrth archebu\'r prawf:');
          expect(fixture.debugElement.query(By.css('#providedEmail + label')).nativeElement.innerHTML.trim())
            .toBe('Trwy e-bost (a ddarparwyd ar adeg archebu)');
          done();
        });
      });
    });
  });
});
