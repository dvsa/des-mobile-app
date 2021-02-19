import { By } from '@angular/platform-browser';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { IonicModule, Config } from '@ionic/angular';
import { MockComponent } from 'ng-mocks';
import { ConfigMock } from 'ionic-mocks';
import { configureTestSuite } from 'ng-bullet';
import { NonTestActivity } from '@dvsa/mes-journal-schema';
import { ActivitySlotComponent } from '../activity-slot';
import { AppConfigProvider } from '../../../../../providers/app-config/app-config';
import { AppConfigProviderMock } from '../../../../../providers/app-config/__mocks__/app-config.mock';
import { TimeComponent } from '../../../../../../components/test-slot/time/time';
import { LocationComponent } from '../../../../../../components/test-slot/location/location';

describe('ActivitySlotComponent', () => {
  let fixture: ComponentFixture<ActivitySlotComponent>;
  let component: ActivitySlotComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        ActivitySlotComponent,
        MockComponent(TimeComponent),
        MockComponent(LocationComponent),
      ],
      providers: [
        { provide: AppConfigProvider, useClass: AppConfigProviderMock },
        { provide: Config, useFactory: () => ConfigMock.instance() },
      ],
      imports: [IonicModule],
    });
  });

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ActivitySlotComponent);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    describe('formatActivityCode', () => {
      beforeEach(() => {
        component.slot = {};
      });
      it('should strip leading zeroes if they exist', () => {
        const cases = [
          { activityCode: undefined, expected: '0' },
          { activityCode: null, expected: '0' },
          { activityCode: '128', expected: '128' },
          { activityCode: '091', expected: '91' },
        ];
        cases.forEach((testCase) => {
          (component.slot as NonTestActivity).activityCode = testCase.activityCode;
          expect(component.formatActivityCode()).toBe(testCase.expected);
        });
      });
    });

    describe('getTitle', () => {
      beforeEach(() => {
        component.slot = {};
      });

      it('should return Unknown for an unmapped code', () => {
        (component.slot as NonTestActivity).activityCode = 'notactivitycode';
        expect(component.getTitle()).toBe('Unknown');
      });
      it('should return the display name if one exists', () => {
        (component.slot as NonTestActivity).activityCode = '091';
        expect(component.getTitle()).toBe('Travel');
      });
      it('should return the activity description if there is no display name', () => {
        (component.slot as NonTestActivity).activityCode = '142';
        expect(component.getTitle()).toBe('Personal development');
      });
    });
  });

  describe('DOM', () => {
    it('should pass the slot start time to the time component', () => {
      component.slot = {
        slotDetail: {
          start: '12345',
        },
      };
      fixture.detectChanges();
      const timeSubComponent = fixture.debugElement
        .query(By.directive(MockComponent(TimeComponent))).componentInstance as TimeComponent;
      expect(timeSubComponent.time).toBe('12345');
    });
    it('should pass something to sub-component location input', () => {
      component.showLocation = true;
      component.slot = {
        slotDetail: {
          start: '12345',
        },
        testCentre: {
          centreName: 'Example Test Centre',
        },
      };
      fixture.detectChanges();
      const subByDirective = fixture.debugElement.query(
        By.directive(MockComponent(LocationComponent)),
      ).componentInstance;
      expect(subByDirective.location).toBe('Example Test Centre');
    });
  });
});
