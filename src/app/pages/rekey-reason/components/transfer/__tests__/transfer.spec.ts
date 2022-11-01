import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AppModule } from '@app/app.module';
import { By } from '@angular/platform-browser';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { configureTestSuite } from 'ng-bullet';
import { AppComponent } from '@app/app.component';
import { MockAppComponent } from '@app/__mocks__/app.component.mock';
import { TransferComponent } from '../transfer';

describe('TransferComponent', () => {
  let fixture: ComponentFixture<TransferComponent>;
  let component: TransferComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        TransferComponent,
      ],
      imports: [
        IonicModule,
        AppModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: AppComponent, useClass: MockAppComponent },

      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(TransferComponent);
    component = fixture.componentInstance;
    component.formGroup = new FormGroup({});
    component.ngOnChanges();
  }));

  describe('class', () => {
    describe('ngOnChanges', () => {
      it('should add the form controls for the checkbox and textarea', () => {
        expect(component.formGroup.get('transferSelected')).not.toBeNull();
        expect(component.formGroup.get('staffNumber')).not.toBeNull();
      });
    });

    describe('selectedValueChanged', () => {
      it('should emit when reason is selected', () => {
        spyOn(component.selectedChange, 'emit');
        component.selectedValueChanged(true);
        expect(component.selectedChange.emit).toHaveBeenCalledWith(true);
      });
      it('should reset the field when unselecting the checkbox', () => {
        const field = component.formGroup.get('staffNumber');
        spyOn(field, 'reset');
        component.selectedValueChanged(false);
        expect(field.reset).toHaveBeenCalled();
      });
    });

    describe('staffNumberValueChanged', () => {
      it('should emit the staff number', () => {
        spyOn(component.staffNumberChange, 'emit');
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
      field.triggerEventHandler('change', { target: { value: '123' } });
      fixture.detectChanges();
      field.triggerEventHandler('change', { target: { value: '' } });
      fixture.detectChanges();
      const validationBar = fixture.debugElement.query(By.css('.validation-bar.invalid'));
      const validationMessage = fixture.debugElement.query(By.css('.validation-message-row'));
      expect(validationBar).toBeDefined();
      expect(validationMessage).toBeDefined();
    });

    it('should not show the validation bar or message after entering a staff number', () => {
      component.selected = true;
      fixture.detectChanges();
      const field = fixture.debugElement.query(By.css('#staffNumber'));
      field.triggerEventHandler('change', { target: { value: '123' } });
      fixture.detectChanges();
      const validationBar = fixture.debugElement.query(By.css('.validation-bar.invalid'));
      const validationMessage = fixture.debugElement.query(By.css('.validation-message-row'));
      expect(validationBar).toBeNull();
      expect(validationMessage).toBeNull();
    });
  });
});
