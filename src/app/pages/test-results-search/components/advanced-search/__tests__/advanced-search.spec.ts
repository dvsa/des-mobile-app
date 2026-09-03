import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockAppComponent } from '@app/__mocks__/app.component.mock';
import { AppComponent } from '@app/app.component';
import { AppModule } from '@app/app.module';
import { DateTimeInputComponent } from '@components/common/datetime-input/date-time-input.component';
import { SearchablePicklistComponentWrapper } from '@components/common/searchable-picklist-wrapper/searchable-picklist-wrapper';
import { IonicModule } from '@ionic/angular';
import { MockComponent } from 'ng-mocks';
import { AdvancedSearchComponent } from '../advanced-search';

describe('AdvancedSearchComponent', () => {
  let fixture: ComponentFixture<AdvancedSearchComponent>;
  let component: AdvancedSearchComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AdvancedSearchComponent,
        MockComponent(DateTimeInputComponent),
        MockComponent(SearchablePicklistComponentWrapper),
      ],
      imports: [AppModule, IonicModule],
      providers: [{ provide: AppComponent, useClass: MockAppComponent }],
    });

    fixture = TestBed.createComponent(AdvancedSearchComponent);
    component = fixture.componentInstance;
  });

  describe('Class', () => {
    it('should create', () => {
      expect(component).toBeDefined();
    });
  });

  describe('onInputChange', () => {
    it('should set rekeySearch to false if event value is empty, field is staffId, and selectedTestCentre is null', () => {
      component.selectedTestCentre = null;
      component.rekeySearch = true;
      component.onInput({ value: '' } as HTMLInputElement, 'staffId');
      expect(component.rekeySearch).toBe(false);
    });

    it('should not change rekeySearch if event value is not empty', () => {
      component.rekeySearch = true;
      component.onInput({ value: '123' } as HTMLInputElement, 'staffId');
      expect(component.rekeySearch).toBe(true);
    });

    it('should not change rekeySearch if field is not staffId', () => {
      component.rekeySearch = true;
      component.onInput({ value: '' } as HTMLInputElement, 'otherField');
      expect(component.rekeySearch).toBe(true);
    });

    it('should remove non-alphanumeric characters and convert to uppercase', () => {
      const event: HTMLInputElement = { value: '12!abC' } as HTMLInputElement;
      component.onInput(event, 'testField');
      expect(event.value).toBe('12ABC');
    });

    it('should convert value to uppercase if it contains only alphanumeric characters', () => {
      const event: HTMLInputElement = { value: 'abc' } as HTMLInputElement;
      component.onInput(event, 'testField');
      expect(event.value).toBe('ABC');
    });

    it('should not change value if it is already uppercase alphanumeric', () => {
      const event: HTMLInputElement = { value: 'ABC123' } as HTMLInputElement;
      component.onInput(event, 'testField');
      expect(event.value).toBe('ABC123');
    });
  });

  describe('changeDate', () => {
    it('should set startDate to event data if the control is "start-date"', () => {
      component.changeDate({ control: 'start-date', data: 'data' });
      expect(component.startDate).toBe('data');
    });
    it('should set endDate to event data if the control is "end-date"', () => {
      component.changeDate({ control: 'end-date', data: 'data' });
      expect(component.endDate).toBe('data');
    });
    it('should break out if the control is neither "start-date" or "end-date"', () => {
      component.changeDate({ control: 'test', data: 'data' });
      expect(component.endDate).toBe('');
      expect(component.startDate).toBe('');
    });
  });

  describe('searchTests', () => {
    it('should create and emit advanced search params', () => {
      component.startDate = 'startDate';
      component.endDate = 'endDate';
      component.importStaffNumber = 'staffNumber';
      component.selectedTestCentre = { costCode: 'dtcNumber' };
      component.selectedActivity.activityCode = 'activityCode';
      [component.selectedCategory] = component.testCategories;
      component.rekeySearch = false;
      component.passCertificateNumber = 'passCert';

      spyOn(component.onSearchTests, 'emit');
      component.searchTests();

      expect(component.onSearchTests.emit).toHaveBeenCalledWith({
        startDate: 'startDate',
        endDate: 'endDate',
        staffNumber: 'staffNumber',
        costCode: 'dtcNumber',
        activityCode: 'activityCode',
        category: '',
        passCertificateNumber: 'passCert',
        rekey: false,
      });
    });
  });

  describe('activitySelectChange', () => {
    it('should set selectedActivity to the params passed in', () => {
      component.activitySelectChange({ activityCode: 'activityCode', description: 'description' });
      expect(component.selectedActivity).toEqual({ activityCode: 'activityCode', description: 'description' });
    });
  });

  describe('blurElement', () => {
    it('should run blur on the active Element if the id does not contain input', () => {
      document.getElementById('advanced-search-pass-certificate-input').focus();
      spyOn(document.activeElement as HTMLElement, 'blur');
      component.blurElement({ id: 'string' } as HTMLElement);
      expect((document.activeElement as HTMLElement).blur).toHaveBeenCalled();
    });
    it('should run blur on the active Element if the id contains input', () => {
      document.getElementById('advanced-search-pass-certificate-input').focus();
      spyOn(document.activeElement as HTMLElement, 'blur');
      component.blurElement({ id: 'input' } as HTMLElement);
      expect((document.activeElement as HTMLElement).blur).not.toHaveBeenCalled();
    });
  });

  describe('categorySelectChange', () => {
    it('should set selectedCategory to the params passed in', () => {
      component.categorySelectChange('test');
      expect(component.selectedCategory).toBe('test');
    });
  });

  describe('setFocus', () => {
    it('should set focusedElement to the params passed in', () => {
      component.setFocus('test');
      expect(component.focusedElement).toBe('test');
    });
  });

  describe('passCertificateInput', () => {
    it('should store the pass certificate value in uppercase', () => {
      component.passCertificateInput('ab12cd34');

      expect(component.passCertificateNumber).toBe('AB12CD34');
    });

    it('should keep the value unchanged when already uppercase', () => {
      component.passCertificateInput('AB12CD34');

      expect(component.passCertificateNumber).toBe('AB12CD34');
    });

    it('should store an empty string when the input value is empty', () => {
      component.passCertificateInput('');

      expect(component.passCertificateNumber).toBe('');
    });

    it('should set pass certificate number to blank when event is missing', () => {
      component.passCertificateInput(undefined as any);

      expect(component.passCertificateNumber).toBe('');
    });
  });
});
