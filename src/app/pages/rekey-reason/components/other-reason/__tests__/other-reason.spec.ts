import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AppModule } from '@app/app.module';
import { By } from '@angular/platform-browser';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { configureTestSuite } from 'ng-bullet';
import { OtherReasonComponent } from '../other-reason';

describe('OtherReasonComponent', () => {
  let fixture: ComponentFixture<OtherReasonComponent>;
  let component: OtherReasonComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        OtherReasonComponent,
      ],
      imports: [
        IonicModule,
        AppModule,
        ReactiveFormsModule,
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(OtherReasonComponent);
    component = fixture.componentInstance;
    component.formGroup = new FormGroup({});
    component.ngOnChanges();
  }));

  describe('class', () => {
    describe('ngOnChanges', () => {
      it('should add the form controls for the checkbox and textarea', () => {
        expect(component.formGroup.get('otherSelected')).not.toBeNull();
        expect(component.formGroup.get('reason')).not.toBeNull();
      });
    });

    describe('selectedValueChanged', () => {
      it('should emit when reason is selected', () => {
        spyOn(component.selectedChange, 'emit');
        component.selectedValueChanged(true);
        expect(component.selectedChange.emit).toHaveBeenCalledWith(true);
      });
      it('should reset the field when unselecting the checkbox', () => {
        const field = component.formGroup.get('reason');
        spyOn(field, 'reset');
        component.selectedValueChanged(false);
        expect(field.reset).toHaveBeenCalled();

      });
    });

    describe('reasonTextChanged', () => {
      it('should emit the reason', () => {
        spyOn(component.reasonChange, 'emit');
        const reasonText = 'reason for change';
        component.reasonTextChanged(reasonText);
        expect(component.reasonChange.emit).toHaveBeenCalledWith(reasonText);
      });
    });
  });

  describe('DOM', () => {
    it('should show the reason textbox when selected', () => {
      component.selected = true;
      fixture.detectChanges();
      const textbox = fixture.debugElement.query(By.css('textarea'));
      expect(textbox).toBeDefined();
    });

    it('should not show the reason textbox when not selected', () => {
      component.selected = false;
      fixture.detectChanges();
      const textbox = fixture.debugElement.query(By.css('textarea'));
      expect(textbox).toBeNull();
    });

    it('should not show validation bar or message initially', () => {
      const validationBar = fixture.debugElement.query(By.css('.validation-bar.invalid'));
      const validationMessage = fixture.debugElement.query(By.css('.validation-message-row'));
      expect(validationBar).toBeNull();
      expect(validationMessage).toBeNull();
    });

    it('should show the validation bar and character count validation text when clearing the reason', () => {
      component.selected = true;
      fixture.detectChanges();
      const field = fixture.debugElement.query(By.css('#otherReason'));
      field.triggerEventHandler('change', { target: { value: 'Reason text' } });
      fixture.detectChanges();
      field.triggerEventHandler('change', { target: { value: '' } });
      fixture.detectChanges();
      const validationBar = fixture.debugElement.query(By.css('.validation-bar.invalid'));
      const validationMessage = fixture.debugElement.query(By.css('.validation-message-row'));
      expect(validationBar).toBeDefined();
      expect(validationMessage).toBeDefined();
    });

    it('should not show the validation bar or message after entering a reason', () => {
      component.selected = true;
      fixture.detectChanges();
      const field = fixture.debugElement.query(By.css('#otherReason'));
      field.triggerEventHandler('change', { target: { value: 'Reason text' } });
      fixture.detectChanges();
      const validationBar = fixture.debugElement.query(By.css('.validation-bar.invalid'));
      const validationMessage = fixture.debugElement.query(By.css('.validation-message-row'));
      expect(validationBar).toBeNull();
      expect(validationMessage).toBeNull();
    });
  });
});
