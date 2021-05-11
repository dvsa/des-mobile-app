import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { By } from '@angular/platform-browser';
import { TranslateModule, TranslateService, TranslateLoader } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { createTranslateLoader } from '@app/app.module';
import { ProvidedEmailComponent } from '../provided-email';

describe('ProvidedEmailComponent', () => {
  let fixture: ComponentFixture<ProvidedEmailComponent>;
  let component: ProvidedEmailComponent;
  let translate: TranslateService;

  configureTestSuite(() => {
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
  });

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ProvidedEmailComponent);
    component = fixture.componentInstance;
    component.formGroup = new FormGroup({});
    component.formGroup.addControl('radioCtrl', new FormControl());
    component.shouldRender = true;
    component.isProvidedEmailAddressChosen = true;
    translate = TestBed.get(TranslateService);
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
