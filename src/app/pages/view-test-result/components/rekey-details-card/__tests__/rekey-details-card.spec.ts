import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { MockComponent } from 'ng-mocks';
import { configureTestSuite } from 'ng-bullet';
import { NeverType } from '@pages/test-report/test-report.effects';
import { TestResultCommonSchema } from '@dvsa/mes-test-schema/categories/common';
import { DataRowComponent } from '@components/common/data-row/data-row';
import { RekeyDetailsCardComponent } from '../rekey-details';

describe('RekeyDetailsCardComponent', () => {
  let fixture: ComponentFixture<RekeyDetailsCardComponent>;
  let component: RekeyDetailsCardComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        RekeyDetailsCardComponent,
        MockComponent(DataRowComponent),
      ],
      imports: [
        IonicModule,
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(RekeyDetailsCardComponent);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    describe('getScheduledStaffNumber', () => {
      it('should return the correct data', () => {
        const data = {
          examinerBooked: 123456,
        };
        component.data = data as NeverType<TestResultCommonSchema>;
        fixture.detectChanges();
        expect(component.scheduledStaffNumber).toEqual('123456');
      });
      it('should return undefined if the data does not exist', () => {
        expect(component.scheduledStaffNumber).toEqual(undefined);
      });
    });
    describe('getConductedStaffNumber', () => {
      it('should return the correct data', () => {
        const data = {
          examinerConducted: 123456,
        };
        component.data = data as NeverType<TestResultCommonSchema>;
        fixture.detectChanges();
        expect(component.conductedStaffNumber).toEqual('123456');
      });
      it('should return undefined if the data does not exist', () => {
        expect(component.conductedStaffNumber).toEqual(undefined);
      });
    });
    describe('getRekeyedStaffNumber', () => {
      it('should return the correct data', () => {
        const data = {
          examinerKeyed: 123456,
        };
        component.data = data as NeverType<TestResultCommonSchema>;
        fixture.detectChanges();
        expect(component.rekeyedStaffNumber).toEqual('123456');
      });
      it('should return undefined if the data does not exist', () => {
        expect(component.rekeyedStaffNumber).toEqual(undefined);
      });
    });
    describe('getTestDate', () => {
      it('should return the correct data', () => {
        const data = {
          journalData: {
            testSlotAttributes: {
              start: '2019-01-12T09:14:00',
            },
          },
        };
        component.data = data as NeverType<TestResultCommonSchema>;
        fixture.detectChanges();
        expect(component.testDate).toEqual('Saturday 12th January 2019');
      });
    });
    describe('getRekeyDate', () => {
      it('should return the correct data', () => {
        const data = {
          rekeyDate: '2019-01-12T09:14:00',
        };
        component.data = data as NeverType<TestResultCommonSchema>;
        fixture.detectChanges();
        expect(component.rekeyDate).toEqual('Saturday 12th January 2019');
      });
    });
  });
});
