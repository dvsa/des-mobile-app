import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import ApexCharts from 'apexcharts';
import { ApexAxisChartSeries, ApexNonAxisChartSeries, ApexOptions, ChartType } from 'ng-apexcharts';
import { isEqual } from 'lodash-es';
import { ExaminerRecordDataWithPercentage } from '@pages/examiner-records/examiner-records.selector';

@Component({
  selector: 'chart',
  templateUrl: 'chart.html',
})
export class ChartComponent implements OnInit, OnChanges {
  @Input()
  public zoomSize: string = '16px';

  @Input()
  public chartId: string = '';

  @Input()
  public chartType: ChartType = 'pie';

  @Input()
  public passedData: ExaminerRecordDataWithPercentage<any>[] = null;

  @Input()
  public showLegend: boolean = false;

  @Input()
  public isPortrait: boolean = false;

  @Input()
  public horizontal: boolean = false;

  @Input()
  public splitLabel: boolean = true;

  @Input()
  public calculatePercentages: boolean = false;

  @Input()
  public transformOptions: {
    portrait: {
      width: number | string, height: number | string,
    },
    landscape: {
      width: number | string, height: number | string,
    }
  } = { portrait: { width: 740, height: 300 }, landscape: { width: 1020, height: 300 } };

  @Input()
  public colors: string[] = ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0'];

  @Input()
  public labelColour: string = '#000000';

  @Input()
  public strokeColour: string = '#FFFFFF';

  @Input()
  public averageColour: string = '#FF0000';

  public dataValues: ApexAxisChartSeries | ApexNonAxisChartSeries = [];
  public labels: string[] = [];
  public average: number = 0;
  public tickCount: number = null;
  public chart: ApexCharts = null;
  public chartOptions: ApexOptions;

  /**
   * Get the chart type as a string.
   *
   * This method returns a string representing the type of chart based on the `chartType` property.
   * If the `chartType` is 'pie', it returns '1Axis'. If the `chartType` is 'bar', it returns '2Axis'.
   *
   * @returns {string} The chart type as a string.
   */
  getChartType(): string {
    switch (this.chartType) {
      case 'pie':
        return '1Axis';
      case 'bar':
        return '2Axis';
    }
  }

  /**
   * Initialize the component.
   *
   * This lifecycle hook is called after Angular has initialized all data-bound properties.
   * It filters the data and sets the chart options.
   */
  ngOnInit() {
    this.filterData();
    this.chartOptions = this.options;
  }

  /**
   * Lifecycle hook that is called after Angular has fully initialized a component's view.
   *
   * This method initializes the ApexCharts chart by selecting the chart element using the `chartId`
   * and rendering the chart with the specified options.
   *
   * @returns {Promise<void>} A promise that resolves when the chart has been rendered.
   */
  async ngAfterViewInit(): Promise<void> {
    let chartElement: HTMLElement = document.getElementById(this.chartId)
    if (chartElement) {
      this.chart = new ApexCharts(chartElement, this.options);
      await this.chart.render();
    }
  }

  /**
   * Lifecycle hook that is called when any data-bound property of a directive changes.
   *
   * This method checks if any of the input properties have changed. If there are changes and the chart exists,
   * it re-filters the data and updates the chart options. If the `chartType` has changed, it renders a new chart.
   *
   * @param {SimpleChanges} changes - An object of key/value pairs for the set of changed properties.
   * @returns {Promise<void>} A promise that resolves when the chart has been updated.
   */
  async ngOnChanges(changes: SimpleChanges): Promise<void>
  {
    //check if there are any changed elements
    const dataChanged = Object.keys(changes)
      .some((key) => !isEqual(changes[key]?.currentValue, changes[key]?.previousValue));

    if (!!this.chart && dataChanged) {
      //if data has changed, re-filter data
      this.filterData();

      //if we want to change chart type, render an entirely new chart
      if (Object.keys(changes).includes('chartType')) {
        this.chart = new ApexCharts(document.getElementById(this.chartId), this.options);
        await this.chart.render();
      } else {
      }
      //update chart with new options
      await this.chart.updateOptions(this.options);
    }
  }

  /**
   * Get the chart options.
   *
   * This getter method returns the configuration options for the ApexCharts chart.
   * It includes settings for states, annotations, fill, chart properties, data labels, stroke, x-axis,
   * y-axis, colors, series, labels, legend, tooltip, and plot options.
   *
   * @returns {ApexOptions} The configuration options for the chart.
   */
  get options(): ApexOptions {
    return {
      states: {
        //disable chart section darkening on click
        active: {
          filter: {
            type: 'none',
          },
        },
      },
      annotations: {
        //draws a line across the y-axis depicting the average value
        yaxis: [
          {
            y: this.average,
            borderColor: this.averageColour,
            borderWidth: 2,
            strokeDashArray: 8,
          },
        ],
      },
      fill: {
        //opacity for the graph's elements
        opacity: 1,
      },
      chart: {
        //disable toolbar that would provide export options
        toolbar: {
          show: false,
        },
        //disable animations
        animations: {
          enabled: false,
        },
        //set font options
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, Roboto',
        fontSize: '24px',
        //Sets the colour for the text used ON the chart
        foreColor: this.labelColour,
        //set width and height of chart based on whether the device is in portrait mode
        width: this.isPortrait ? this.transformOptions.portrait.width : this.transformOptions.landscape.width,
        height: this.isPortrait ? this.transformOptions.portrait.height : this.transformOptions.landscape.height,
        //type of chart (pie, bar, etc.)
        type: this.chartType,
      },
      dataLabels: {
        //enables an external display of the value of the chart element on any chart that isn't a bar
        enabled: true,
        //styling for this label
        style: {
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, Roboto',
          fontSize: this.getFontSize(),
          fontWeight: 'bold',
          colors: [this.labelColour],
        },
        //gives the label a background color
        background: {
          enabled: true,
        },
        //disables drop shadow on the label
        dropShadow: {
          enabled: false,
        },
        //Applies an offset to the label for better positioning
        offsetY: 5,

        formatter: (val, opts) => {
          //apply no styling if it's a bar chart
          if (this.chartType === 'bar') {
            return val;
          }
          /*
          If the label itself contains the full name of the value, trim that section off and only take the code,
          then display either the percentage of the total or the value.
          Example, where the label is split and the total is 10:
          name: "M1 - Test Question" value: 2
          returns "M1: 20%"
          */
          if (this.splitLabel) {
            return this.calculatePercentages ?
              opts.w.globals.labels[opts.seriesIndex].split(/[ ,]+/)[0] + ':  ' +
              Number(val).toFixed(1) + '%' :
              opts.w.globals.labels[opts.seriesIndex].split(/[ ,]+/)[0] + ':  ' +
              this.passedData[opts.seriesIndex].percentage;
          }
          return this.calculatePercentages ?
            opts.w.globals.labels[opts.seriesIndex] + ':  ' +
            Number(val).toFixed(1) + '%' :
            opts.w.globals.labels[opts.seriesIndex] + ':  ' +
            this.passedData[opts.seriesIndex].percentage;
        },
      },
      //Applies a border to the chart elements
      stroke: { show: true, colors: [this.strokeColour] },
      xaxis: {
        //disable the x-axis from darkening when the user clicks on it
        crosshairs: {
          show: false,
        },
        //render the labels that appear on the bottom of the graphs
        labels: {
          //apply an offset
          offsetY: this.horizontal ? 10 : 0,
          //style the font
          style: {
            fontSize: '24px',
            colors: this.labelColour,
          },
          /**due to the chart having rotate functionality, we should account for both possibilities
           * if horizontal is set to true (the values on the side and the amount at the bottom), return the number with
           * no decimal point.
           *
           * otherwise, split the value sent in by spaces and return the first element,
           * which will be the code we use to refer to the full value. (M1 - test question = M1)
           */
          formatter: (val) => {
            if (this.horizontal) {
              return Number(val).toFixed(0);
            }
            return this.splitLabel ? val.toString().split(/[ ,]+/)[0] : val;
          },
        },
      },
      yaxis: {
        //disable the y-axis from darkening when the user clicks on it
        crosshairs: {
          show: false,
        },
        //value used to determine how many "steps" are allowed to appear for the values
        tickAmount: this.tickCount,
        //render the labels that appear on the side of the graphs
        labels: {
          //apply an offset
          offsetY: this.horizontal ? 7 : 6,
          //style the font
          style: {
            fontSize: '24px',
            colors: this.labelColour,
          },
          /**due to the chart having rotate functionality, we should account for both possibilities
           * if horizontal is set to false (the values on the side and the amount at the bottom), return the number with
           * no decimal point.
           *
           * otherwise, split the value sent in by spaces and return the first element,
           * which will be the code we use to refer to the full value. (M1 - test question = M1)
           */
          formatter: (val) => {
            if (this.horizontal) {
              return this.splitLabel ? val.toString().split(/[ ,]+/)[0] : val.toString();
            }
            return val.toFixed(0).toString();

          },
        },
      },
      //define the colours that should be used by the chart's elements
      colors: this.colors,
      //data to be used by the chart
      series: this.dataValues,
      //labels for the graph to describe the elements
      labels: this.labels,
      //value determining whether the graph should render a box which explains the elements on the graph
      legend: {
        show: this.showLegend,
      },
      //options for the "tooltip", a popup that appears whenever the graph is clicked
      tooltip: {
        //value that determines whether the tooltip appears where the mouse clicked
        // or on a set point on the graph element
        followCursor: false,
        //whether the tooltip appears at all or not
        enabled: false,
        //formatting for the tooltip
        custom: function({ series, seriesIndex, dataPointIndex, w }) {
          return '<div class="ion-padding">' +
            '<ion-text class="mes-data">' +
            '' + w.globals.labels[dataPointIndex] + ': ' + series[seriesIndex][dataPointIndex] + '' +
            '</ion-text>' +
            '</div>';
        },
      },
      //options for specific graph types
      plotOptions: {
        bar: {
          //determines whether the graph should render horizontally
          horizontal: this.horizontal,
          dataLabels: {
            orientation: 'horizontal',
            position: 'bottom'
          }
        },
        pie: {
          dataLabels: {
            //offset the data labels
            offset: -15,
          },
          //set whether the graph elements should expand on click
          expandOnClick: false,
        },
      },
    } as ApexOptions;
  }

  /**
   * Morphs the passed data into a format that can be used by the graph, and calculates the average and tick count
   * for the graph.
   *
   * This method processes the `passedData` to extract labels and values, calculates the average value, determines
   * the tick count,
   * and sets the `dataValues` property based on the chart type.
   */
  filterData() {
    this.labels = this.passedData.map((val) => val.item);
    const values: number[] = this.passedData.map((val) => val.count);
    this.average = ((values.reduce((a, b) => a + b, 0)) / values.length) || 0;
    this.tickCount = this.getTickCount(values);

    this.dataValues = (this.getChartType() === '1Axis')
      ? values as ApexNonAxisChartSeries
      : [{ data: values }] as ApexAxisChartSeries;
  }

  /**
   * Get the tick count for the y-axis.
   *
   * This method returns the largest value in the provided array if that value is less than or equal to 5.
   * The purpose of this is to prevent the chart's y-axis from attempting to draw numbers with decimal points,
   * as they are not allowed.
   *
   * @param {number[]} numbers - An array of numbers to evaluate.
   * @returns {number | null} The largest value if it is less than or equal to 5, otherwise null.
   */
  getTickCount(numbers: number[]): number | null {
    const max = Math.max(...numbers)
    return max <= 5 ? max : null;
  }

  /**
   * Get the font size based on the zoom size.
   *
   * This method returns a string representing the font size in pixels based on the `zoomSize` property.
   * It supports three zoom sizes: 'text-zoom-regular', 'text-zoom-large', and 'text-zoom-x-large'.
   *
   * @returns {string} The font size in pixels.
   */
  getFontSize(): string {
    switch (this.zoomSize) {
      case 'text-zoom-regular':
        return '16px';
      case 'text-zoom-large':
        return '18px';
      case 'text-zoom-x-large':
        return '20px';
    }
  }
}
