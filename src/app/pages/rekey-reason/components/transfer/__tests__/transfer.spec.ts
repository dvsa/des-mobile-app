import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { MockAppComponent } from '@app/__mocks__/app.component.mock';
import { AppComponent } from '@app/app.component';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { IonCol, IonInput, IonItem, IonRow } from '@ionic/angular';

import { TransferComponent } from '../transfer';

describe('TransferComponent', () => {
  let fixture: ComponentFixture<TransferComponent>;
  let component: TransferComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, IonCol, IonInput, IonItem, IonRow, TransferComponent],
      providers: [{ provide: AppComponent, useClass: MockAppComponent }],
    });

    fixture = TestBed.createComponent(TransferComponent);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({});
    component.ngOnChanges();
  });

  describe('class', () => {
    describe('ngOnChanges', () => {
      it('should add the form controls for the checkbox and textarea', () => {
        expect(component.formGroup.get('transferSelected')).not.toBeNull();
        expect(component.formGroup.get('staffNumber')).not.toBeNull();
      });
    });

    describe('selectedValueChanged', () => {
      it('should emit when reason is selected', () => {
        vi.spyOn(component.selectedChange, 'emit').mockReturnValue(undefined);
        component.selectedValueChanged(true);
        expect(component.selectedChange.emit).toHaveBeenCalledWith(true);
      });
      it('should reset the field when unselecting the checkbox', () => {
        const field = component.formGroup.get('staffNumber');
        vi.spyOn(field, 'reset').mockReturnValue(undefined);
        component.selectedValueChanged(false);
        expect(field.reset).toHaveBeenCalled();
      });
    });

    describe('staffNumberValueChanged', () => {
      it('should emit the staff number', () => {
        vi.spyOn(component.staffNumberChange, 'emit').mockReturnValue(undefined);
        const staffNumber = '123';
        component.staffNumberValueChanged(staffNumber);
        expect(component.staffNumberChange.emit).toHaveBeenCalledWith(123);
      });
    });
  });

  describe('DOM', () => {
    it('should show the staff number field when selected', () => {
      component.selected = true;
      fixture.detectChanges();
      const textbox = fixture.debugElement.query(By.css('#staffNumber'));
      expect(textbox).toBeDefined();
    });

    it('should not show the staff number field when not selected', () => {
      component.selected = false;
      fixture.detectChanges();
      const textbox = fixture.debugElement.query(By.css('#staffNumber'));
      expect(textbox).toBeNull();
    });

    it('should not show validation bar or message initially', () => {
      const validationBar = fixture.debugElement.query(By.css('.validation-bar.invalid'));
      const validationMessage = fixture.debugElement.query(By.css('.validation-message-row'));
      expect(validationBar).toBeNull();
      expect(validationMessage).toBeNull();
    });

    it('should show the validation bar and required text when clearing the staff number', () => {
      component.selected = true;
      fixture.detectChanges();
      const field = fixture.debugElement.query(By.css('#staffNumber'));
      field.triggerEventHandler('ionChange', { detail: { value: '123' } });
      fixture.detectChanges();
      field.triggerEventHandler('ionChange', { detail: { value: '' } });
      fixture.detectChanges();
      const validationBar = fixture.debugElement.query(By.css('.validation-bar.ng-invalid'));
      const validationMessage = fixture.debugElement.query(By.css('.validation-message-row'));
      expect(validationBar).toBeDefined();
      expect(validationMessage).toBeDefined();
    });

    it('should not show the validation bar or message after entering a staff number', () => {
      component.selected = true;
      fixture.detectChanges();
      const field = fixture.debugElement.query(By.css('#staffNumber'));
      field.triggerEventHandler('ionChange', { detail: { value: '123' } });
      fixture.detectChanges();
      const validationBar = fixture.debugElement.query(By.css('.validation-bar.ng-invalid'));
      const validationMessage = fixture.debugElement.query(By.css('.validation-message-row'));
      expect(validationBar).toBeNull();
      expect(validationMessage).toBeNull();
    });
  });
});
