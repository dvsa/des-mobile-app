import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { provideMockStore } from '@ngrx/store/testing';
import { ExaminerReportsCard } from '@pages/examiner-records/components/examiner-reports-card/examiner-reports-card';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';

describe('ExaminerReportsCard', () => {
  let fixture: ComponentFixture<ExaminerReportsCard>;
  let component: ExaminerReportsCard;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ExaminerReportsCard],
      imports: [IonicModule],
      providers: [
        provideMockStore({ ...{} }),
        { provide: OutcomeBehaviourMapProvider, useClass: OutcomeBehaviourMapProvider },
      ],
    });

    fixture = TestBed.createComponent(ExaminerReportsCard);
    component = fixture.componentInstance;
  }));
  describe('getTapText', () => {
    it('should return the trueCondition text if showExpandedData is true', () => {
      component.showExpandedData = true;
      expect(component.getTapText('true', 'false')).toEqual('true');
    });
    it('should return the falseCondition text if showExpandedData is false', () => {
      component.showExpandedData = false;
      expect(component.getTapText('true', 'false')).toEqual('false');
    });
  });

  describe('handleCardClick', () => {
    it('should toggle showExpandedData if canExpand is true', () => {
      component.canExpand = true;
      component.showExpandedData = false;
      component.handleCardClick();
      expect(component.showExpandedData).toEqual(true);
    });
    it('should not toggle showExpandedData if canExpand is false', () => {
      component.canExpand = false;
      component.showExpandedData = false;
      component.handleCardClick();
      expect(component.showExpandedData).toEqual(false);
    });
  });

  describe('getTotal', () => {
    it('should return 10 if the total number of data points is equal to 10', () => {
      expect(
        component.getTotal([
          {
            item: '1',
            count: 1,
            percentage: 'test',
          },
          {
            item: '2',
            count: 2,
            percentage: 'test',
          },
          {
            item: '3',
            count: 7,
            percentage: 'test',
          },
        ])
      ).toEqual(10);
    });
  });

  describe('setMinWidth', () => {
    it(
      'should return the portrait width if the card has a chart, ' + 'it is not a bar chart and isPortrait is true',
      () => {
        component.chartTransform = { portrait: { width: 740, height: 300 }, landscape: { width: 1020, height: 300 } };
        component.hasChart = true;
        component.isPortrait = true;
        component.chartType = 'pie';

        expect(component.setMinWidth()).toEqual('740.0px');
      }
    );
    it(
      'should return the landscape width if the card has a chart, ' + 'it is not a bar chart and isPortrait is false',
      () => {
        component.chartTransform = { portrait: { width: 740, height: 300 }, landscape: { width: 1020, height: 300 } };
        component.hasChart = true;
        component.isPortrait = false;
        component.chartType = 'pie';

        expect(component.setMinWidth()).toEqual('1020.0px');
      }
    );
    it(
      'should return the portrait width multiplied by 1.07 if the card has a chart, ' +
        'it is a bar chart and isPortrait is true',
      () => {
        component.chartTransform = { portrait: { width: 740, height: 300 }, landscape: { width: 1020, height: 300 } };
        component.hasChart = true;
        component.isPortrait = true;
        component.chartType = 'bar';

        expect(component.setMinWidth()).toEqual('791.8px');
      }
    );
    it(
      'should return the landscape width multiplied by 1.07 if the card has a chart, ' +
        'it is a bar chart and isPortrait is true',
      () => {
        component.chartTransform = { portrait: { width: 740, height: 300 }, landscape: { width: 1020, height: 300 } };
        component.hasChart = true;
        component.isPortrait = false;
        component.chartType = 'bar';

        expect(component.setMinWidth()).toEqual('1060.8px');
      }
    );
    it('should return null if hasChart if false and chartType is not bar', () => {
      component.chartTransform = { portrait: { width: 740, height: 300 }, landscape: { width: 1020, height: 300 } };
      component.hasChart = false;
      component.chartType = null;

      expect(component.setMinWidth()).toEqual(null);
    });
  });

  describe('filterDataForGrid', () => {
    it('should return the passed data as an array', () => {
      expect(
        component.filterDataForGrid([
          {
            item: '1',
            count: 1,
            percentage: 'test',
          },
          {
            item: '2',
            count: 2,
            percentage: 'test',
          },
          {
            item: '3',
            count: 7,
            percentage: 'test',
          },
        ])
      ).toEqual([
        ['1', 1, 'test'],
        ['2', 2, 'test'],
        ['3', 7, 'test'],
      ] as any[][]);
    });
    it('should return an empty array if the passed data is empty', () => {
      expect(component.filterDataForGrid(null)).toEqual([[]]);
    });
  });
});
