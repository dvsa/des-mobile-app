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

  /**Get the total number of individual instances of data*/
  getTotal = <T>(
    value: ExaminerRecordData<T>[],
  ): number => value.reduce((total, val) => total + Number(val.count), 0);

  /**Format data for use in data grid*/
  filterDataForGrid<T>(examinerRecordData: ExaminerRecordData<T>[]): T[][] {
    if (!!examinerRecordData && examinerRecordData.length > 0) {
      return examinerRecordData.map((obj) => Object.values(obj) as T[]);
    }
    return [[]];
  }

  /**Return the relevant text string based on whether the card is expanded*/
  getTapText(trueCondition: string, falseCondition: string) {
    return this.showExpandedData ? trueCondition : falseCondition;
  }

  /**Toggle the expandable data if this card is allowed to expand*/
  handleCardClick() {
    if (this.canExpand) {
      this.showExpandedData = !this.showExpandedData;
    }
  }

  /**Set the minimum width of the card, so it appears as the same size when graphs are disabled.
   * If the type is bar, add additional padding to make the card look right
   * (1.07 and 1.04 are not determined in any mathematical way, they are values that appear to work consistently)*/
  setMinWidth(): string {
    let minWidth: number = null;
    if (this.hasChart) {
      minWidth = (this.isPortrait ? this.chartTransform.portrait.width : this.chartTransform.landscape.width);
    }
    if (this.chartType === 'bar') {
      minWidth = (this.isPortrait ? minWidth * 1.07 : minWidth * 1.04);
    }
    if (minWidth !== null) {
      return minWidth.toFixed(1) + 'px';
    } else {
      return null;
    }
  }
}
