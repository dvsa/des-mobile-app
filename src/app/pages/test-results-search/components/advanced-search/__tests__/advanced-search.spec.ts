import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { IonDatetime, IonicModule } from '@ionic/angular';
import { AppModule } from '@app/app.module';
import { AppComponent } from '@app/app.component';
import { MockAppComponent } from '@app/__mocks__/app.component.mock';
import { MockComponent } from 'ng-mocks';
import { DateTimeInputComponent } from '@components/common/datetime-input/date-time-input.component';
import { AdvancedSearchComponent } from '../advanced-search';

describe('AdvancedSearchComponent', () => {
  let fixture: ComponentFixture<AdvancedSearchComponent>;
  let component: AdvancedSearchComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        AdvancedSearchComponent,
        MockComponent(DateTimeInputComponent),
      ],
      imports: [
        AppModule,
        IonicModule,
      ],
      providers: [
        { provide: AppComponent, useClass: MockAppComponent },
      ],
    });

    fixture = TestBed.createComponent(AdvancedSearchComponent);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    it('should create', () => {
      expect(component).toBeDefined();
    });
  });

  describe('upperCaseAlphaNum', () => {
    const testItem: any = {
      target: {
        value: '12!abC',
      },
    };
    it('should change the string within the object to contain only uppercase alphanumeric characters', () => {
      component.upperCaseAlphaNum(testItem);
      expect(testItem.target.value).toEqual('12ABC');
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
      component.dtcNumber = 'dtcNumber';
      component.selectedActivity.activityCode = 'activityCode';
      [component.selectedCategory] = component.testCategories;

      spyOn(component.onSearchTests, 'emit');
      component.searchTests();

      expect(component.onSearchTests.emit).toHaveBeenCalledWith({
        startDate: 'startDate',
        endDate: 'endDate',
        staffNumber: 'staffNumber',
        costCode: 'dtcNumber',
        activityCode: 'activityCode',
        category: '',
      });
    });
  });

  describe('activitySelectChange', () => {
    it('should set selectedActivity to the params passed in', () => {
      component.activitySelectChange({ activityCode: 'activityCode', description: 'description' });
      expect(component.selectedActivity).toEqual({ activityCode: 'activityCode', description: 'description' });
    });
  });

  describe('handleClear', () => {
    it('should clear startDate if startEnd is "start"', () => {
      component.startDate = 'test';
      component.handleClear({ cancel: () => {} } as IonDatetime, 'start');
      expect(component.startDate).toEqual('');
    });
    it('should clear endDate if startEnd is "end"', () => {
      component.endDate = 'test';
      component.handleClear({ cancel: () => {} } as IonDatetime, 'end');
      expect(component.endDate).toEqual('');
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
});
