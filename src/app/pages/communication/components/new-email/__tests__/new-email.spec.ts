import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { By } from '@angular/platform-browser';
import { TranslateModule, TranslateService, TranslateLoader } from '@ngx-translate/core';
import { UntypedFormGroup, UntypedFormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { createTranslateLoader } from '@app/app.module';
import { NewEmailComponent } from '../new-email';

describe('NewEmailComponent', () => {
  let fixture: ComponentFixture<NewEmailComponent>;
  let component: NewEmailComponent;
  let translate: TranslateService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        NewEmailComponent,
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

    fixture = TestBed.createComponent(NewEmailComponent);
    component = fixture.componentInstance;
    translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en');
    component.formGroup = new UntypedFormGroup({});
    const radioCtrl = new UntypedFormControl('radioCtrl');
    component.formGroup.addControl('radioCtrl', radioCtrl);
    component.radioButtonControl = radioCtrl;
    const newEmailCtrl = new UntypedFormControl('newEmailCtrl');
    component.formGroup.addControl('newEmailCtrl', newEmailCtrl);
    component.formControl = newEmailCtrl;
    component.isNewEmailAddressChosen = true;
  }));

  describe('Class', () => {
    describe('initialise', () => {
      it('component should initialise', () => {
        expect(component).toBeTruthy();
      });
    });
  });

  describe('ngOnChanges', () => {
    it('should set up the form control if there isn\'t already one', () => {
      component.radioButtonControl = null;
      component.ngOnChanges();
      expect(component.formGroup.get('radioCtrl')).not.toBeNull();
    });
    it('should set up the second form control if there isn\'t already one', () => {
      component.formControl = null;
      component.ngOnChanges();
      expect(component.formGroup.get('newEmailCtrl')).not.toBeNull();
    });
    it('should set up additional validators if necessary', () => {
      component.formControl = null;
      component.isNewEmailAddressChosen = true;
      component.ngOnChanges();

      expect(component.formControl).not.toBeNull();
      expect(component.formControl.validator).not.toBeNull();
    });
  });

  describe('newEmailRadioSelected', () => {
    it('should emit newEmailRadioSelect with correct parameters', () => {
      spyOn(component.newEmailRadioSelect, 'emit');
      component.newEmailRadioSelected();
      expect(component.newEmailRadioSelect.emit).toHaveBeenCalledWith(NewEmailComponent.newEmail);
    });
  });

  describe('newEmailTextChanged', () => {
    it('should emit newEmailTextChanged with correct parameters', () => {
      spyOn(component.newEmailTextChange, 'emit');
      component.formControl.setValidators(null);
      component.newEmailTextChanged('1');
      expect(component.newEmailTextChange.emit).toHaveBeenCalledWith('1');
    });
  });

  describe('DOM', () => {
    describe('i18n', () => {
      it('should render in English by default', (done) => {
        translate.use('en').subscribe(() => {
          fixture.detectChanges();
          expect(fixture.debugElement.query(By.css('.validation-text')).nativeElement.innerHTML.trim())
            .toBe('Please enter a valid email');
          expect(fixture.debugElement.query(By.css('.communication-text')).nativeElement.innerHTML.trim())
            .toBe('Enter the email address you want us to send your results to.');
          done();
        });
      });

      it('should render in Welsh when its a Welsh test', (done) => {
        translate.use('cy').subscribe(() => {
          fixture.detectChanges();
          expect(fixture.debugElement.query(By.css('.validation-text')).nativeElement.innerHTML.trim())
            .toBe('Nodwch e-bost dilys');
          expect(fixture.debugElement.query(By.css('.communication-text')).nativeElement.innerHTML.trim())
            .toBe('Nodwch y cyfeiriad e-bost rydych chi am i ni anfon eich canlyniadau ato');
          done();
        });
      });
    });
  });
});
