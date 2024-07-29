import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { ExaminerRecordData } from '@pages/examiner-records/examiner-records.selector';
import { ChartType } from 'ng-apexcharts';

export interface ExaminerReportsCardClick {
  isExpanded: boolean;
  title: string;
}

@Component({
  selector: 'examiner-reports-card',
  templateUrl: 'examiner-reports-card.html',
  styleUrls: ['examiner-reports-card.scss'],
})

export class ExaminerReportsCard {

  @Output()
  onCardClick: EventEmitter<ExaminerReportsCardClick> = new EventEmitter<ExaminerReportsCardClick>();

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

  /**
   * Calculate the total number of individual instances of data.
   *
   * This method takes an array of `ExaminerRecordData` objects and sums up the `count` property of each object.
   * The `count` property is converted to a number before summing.
   *
   * @template T - The type of the data contained in the `ExaminerRecordData` objects.
   * @param {ExaminerRecordData<T>[]} value - The array of `ExaminerRecordData` objects to be totaled.
   * @returns {number} The total count of all `ExaminerRecordData` objects.
   */
  getTotal = <T>(
    value: ExaminerRecordData<T>[],
  ): number => value.reduce((total, val) => total + Number(val.count), 0);

  /**
   * Format data for use in a data grid.
   *
   * This method takes an array of `ExaminerRecordData` objects and converts each object
   * into an array of its values. If the input array is empty or null, it returns an array
   * containing an empty array.
   *
   * @template T - The type of the data contained in the `ExaminerRecordData` objects.
   * @param {ExaminerRecordData<T>[]} examinerRecordData - The array of `ExaminerRecordData` objects to be formatted.
   * @returns {T[][]} A two-dimensional array where each inner array contains the values of an `ExaminerRecordData`
   * object.
   */
  filterDataForGrid<T>(examinerRecordData: ExaminerRecordData<T>[]): T[][] {
    if (!!examinerRecordData && examinerRecordData.length > 0) {
      return examinerRecordData.map((obj) => Object.values(obj) as T[]);
    }
    return [[]];
  }

  /**
   * Return the relevant text string based on whether the card is expanded.
   *
   * This method returns the `trueCondition` string if `showExpandedData` is true,
   * otherwise it returns the `falseCondition` string.
   *
   * @param {string} trueCondition - The text to return if the card is expanded.
   * @param {string} falseCondition - The text to return if the card is not expanded.
   * @returns {string} The relevant text string based on the card's expanded state.
   */
  getTapText(trueCondition: string, falseCondition: string): string {
    return this.showExpandedData ? trueCondition : falseCondition;
  }

  /**
   * Toggle the expandable data if this card is allowed to expand.
   *
   * This method toggles the `showExpandedData` property if the card can expand,
   * and emits an event with the new expanded state and the card title.
   */
  handleCardClick() {
    if (this.canExpand) {
      this.showExpandedData = !this.showExpandedData;
      this.onCardClick.emit({ isExpanded: this.showExpandedData, title: this.cardTitle })
    }
  }

  /**
   * Set the minimum width of the card, so it appears as the same size when graphs are disabled.
   * If the type is bar, add additional padding to make the card look right.
   * (1.07 and 1.04 are not determined in any mathematical way, they are values that appear to work consistently)
   *
   * @returns {string} The minimum width of the card in pixels, or null if no minimum width is set.
   */
  setMinWidth(): string {
    if (!this.hasChart) return null;

    let minWidth = this.isPortrait ? this.chartTransform.portrait.width : this.chartTransform.landscape.width;
    if (this.chartType === 'bar') {
      minWidth *= this.isPortrait ? 1.07 : 1.04;
    }

    return minWidth.toFixed(1) + 'px';
  }
}
