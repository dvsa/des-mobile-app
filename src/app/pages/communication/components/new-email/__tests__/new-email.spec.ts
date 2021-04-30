import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { IonicModule } from 'ionic-angular';
import { By } from '@angular/platform-browser';
import { TranslateModule, TranslateService, TranslateLoader } from '@ngx-translate/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { configureTestSuite } from 'ng-bullet';
import { createTranslateLoader } from '../../../../../app/app.module';
import { NewEmailComponent } from '../new-email';
import * as welshTranslations from '../../../../../assets/i18n/cy.json';

describe('NewEmailComponent', () => {
  let fixture: ComponentFixture<NewEmailComponent>;
  let component: NewEmailComponent;
  let translate: TranslateService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        NewEmailComponent,
      ],
      imports: [
        IonicModule,
        HttpClientModule,
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
    fixture = TestBed.createComponent(NewEmailComponent);
    component = fixture.componentInstance;
    translate = TestBed.get(TranslateService);
    translate.setDefaultLang('en');
    component.formGroup = new FormGroup({});
    const radioCtrl = new FormControl('radioCtrl');
    component.formGroup.addControl('radioCtrl', radioCtrl);
    component.radioButtonControl = radioCtrl;
    const newEmailCtrl = new FormControl('newEmailCtrl');
    component.formGroup.addControl('newEmailCtrl', newEmailCtrl);
    component.formControl = newEmailCtrl;
    component.isNewEmailAddressChosen = true;
  }));

  describe('DOM', () => {
    describe('i18n', () => {
      it('should render in English by default', () => {
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('.validation-text')).nativeElement.innerHTML.trim())
          .toBe('Please enter a valid email');
        expect(fixture.debugElement.query(By.css('.communication-text')).nativeElement.innerHTML.trim())
          .toBe('Enter the email address you want us to send your results to.');
      });
      it('should render in Welsh when its a Welsh test', (done) => {
        translate.use('cy').subscribe(() => {
          fixture.detectChanges();
          expect(fixture.debugElement.query(By.css('.validation-text')).nativeElement.innerHTML.trim())
            .toBe(`${(<any>welshTranslations).communication.newEmailValidation}`);
          expect(fixture.debugElement.query(By.css('.communication-text')).nativeElement.innerHTML.trim())
            .toBe((<any>welshTranslations).communication.newEmail);
          done();
        });
      });
    });
  });
});
