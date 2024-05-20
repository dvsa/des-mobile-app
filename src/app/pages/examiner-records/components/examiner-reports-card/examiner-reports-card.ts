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
  chartSubtitle: boolean = false;
  @Input()
  isPortrait: boolean = false;
  @Input()
  useGrid: boolean = true;
  @Input()
  hasCustomMainContent: boolean = false;
  @Input()
  hasCustomExpandedContent: boolean = false;
  @Input()
  displayColoursOnDataGrid: boolean = false;
  @Input()
  showExpandedData: boolean = false;
  @Input()
  canExpand: boolean = true;
  @Input()
  showMainContent: boolean = true;
  @Input()
  hasChart: boolean = true;
  @Input()
  showTotal: boolean = true;
  @Input()
  splitChartLabel: boolean = false;
  @Input()
  darkColours: boolean = false;
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
    return this.showExpandedData ? trueCondition : falseCondition;
  }

  handleCardClick() {
    if (this.canExpand) {
      this.showExpandedData = !this.showExpandedData;
    }
  }

  setMinWidth(): string {
    let minWidth: number = null;
    if (this.hasChart) {
      minWidth = (this.isPortrait ? this.chartTransform.portrait.width : this.chartTransform.landscape.width)
    }
    if (this.chartType === 'bar') {
      minWidth += (this.isPortrait ? minWidth * 0.07 : minWidth * 0.04)
    }
    return minWidth + 'px';
  }
}
