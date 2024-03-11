import { Component, Input } from '@angular/core';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { ExaminerRecordData } from '@pages/examiner-records/examiner-records.selector';
import { ChartType } from 'ng-apexcharts';

@Component({
  selector: 'examiner-reports-card',
  templateUrl: 'examiner-reports-card.html',
  styleUrls: ['examiner-reports-card.scss'],
})
export class ExaminerReportsCard {

  @Input()
  passedData: ExaminerRecordData<any>[] = null;
  @Input()
  chartID: string = null;
  @Input()
  averageColour: string = '#000000';
  @Input()
  cardTitle: string = 'Card title';
  @Input()
  gridHeaders: string[] = ['Item', 'Amount', 'Percentage of total'];
  @Input()
  strokeColour: string = '#FFFFFF';
  @Input()
  labelColour: string = '#000000';
  @Input()
  isPortrait: boolean = false;
  @Input()
  showCustomContent: boolean = false;
  @Input()
  hasCustomContent: boolean = false;
  @Input()
  displayColoursOnDataGrid: boolean = false;
  @Input()
  showData: boolean = false;
  @Input()
  showChart: boolean = true;
  @Input()
  splitChartLabel: boolean = false;
  @Input()
  darkColours: boolean = false;
  @Input()
  cardIsClickable: boolean = true;
  @Input()
  chartType: ChartType = 'bar';
  @Input()
  colourScheme: string[] = [
    '#008FFB',
    '#ED6926',
    '#FF526F',
    '#007C42',
    '#a05195',
  ];
  @Input() public chartTransform: { portrait: {
    width: number, height: number,
  },
  landscape: {
    width: number, height: number,
  }
  } = { portrait: { width: 740, height: 300 }, landscape: { width: 1020, height: 300 } };

  constructor(public accessibilityService: AccessibilityService) {
  }

  getTotal = <T>(
    value: ExaminerRecordData<T>[],
  ): number => value.reduce((total, val) => total + Number(val.count), 0);

  filterDataForGrid<T>(examinerRecordData: ExaminerRecordData<T>[]): T[][] {
    if (!!examinerRecordData) {
      return examinerRecordData.map((obj) => Object.values(obj) as T[]);
    }
    return [[]];
  }

  getTapText(trueCondition: string, falseCondition: string) {
    return this.hasCustomContent ?
      this.showCustomContent ? trueCondition : falseCondition :
      this.showData ? trueCondition : falseCondition;
  }
}
