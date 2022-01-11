import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '@app/app.module';
import { FullLicenceHeldComponent } from '../full-licence-held-toggle';

describe('FullLicenceHeldComponent', () => {
  let fixture: ComponentFixture<FullLicenceHeldComponent>;
  let component: FullLicenceHeldComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        FullLicenceHeldComponent,
      ],
      imports: [
        IonicModule,
        AppModule,
        ReactiveFormsModule,
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(FullLicenceHeldComponent);
    component = fixture.componentInstance;
    component.formGroup = new FormGroup({});
    component.fullLicenceHeldChange = new EventEmitter();
  }));

  describe('Class', () => {
    describe('fullLicenceHeldChanged', () => {
      it('should convert value passed in to a boolean and emit', () => {
        spyOn(component.fullLicenceHeldChange, 'emit');
        component.fullLicenceHeldChanged('Y');
        expect(component.fullLicenceHeldChange.emit).toHaveBeenCalledWith(true);
      });
    });
  });
  describe('DOM', () => {
    it('should call fullLicenceHeldChanged with Y when Yes is pressed', () => {
      spyOn(component, 'fullLicenceHeldChanged');
      component.ngOnChanges();
      const declarationSignedRadio = fixture.debugElement.query(By.css('#full-licence-held-yes'));
      declarationSignedRadio.triggerEventHandler('change', { target: { value: 'Y' } });
      fixture.detectChanges();
      expect(component.fullLicenceHeldChanged).toHaveBeenCalledWith('Y');
    });
    it('should call fullLicenceHeldChanged with N when No is pressed', () => {
      spyOn(component, 'fullLicenceHeldChanged');
      component.ngOnChanges();
      const declarationSignedRadio = fixture.debugElement.query(By.css('#full-licence-held-no'));
      declarationSignedRadio.triggerEventHandler('change', { target: { value: 'N' } });
      fixture.detectChanges();
      expect(component.fullLicenceHeldChanged).toHaveBeenCalledWith('N');
    });
  });
});
