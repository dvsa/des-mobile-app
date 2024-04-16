import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import ApexCharts from 'apexcharts';
import { ApexAxisChartSeries, ApexNonAxisChartSeries, ApexOptions, ChartType } from 'ng-apexcharts';
import { isEqual } from 'lodash-es';
import { ExaminerRecordData } from '@pages/examiner-records/examiner-records.selector';

@Component({
  selector: 'chart',
  templateUrl: 'chart.html',
})
export class ChartComponent implements OnInit, OnChanges {
  @Input() public chartId: string = '';
  @Input() public chartType: ChartType = 'pie';
  @Input() public passedData: ExaminerRecordData<any>[] = null;
  @Input() public showLegend: boolean = false;
  @Input() public isPortrait: boolean = false;
  @Input() public horizontal: boolean = false;
  @Input() public splitLabel: boolean = true;
  @Input() public calculatePercentages: boolean = false;
  @Input() public transformOptions: {
    portrait: {
      width: number | string, height: number | string,
    },
    landscape: {
      width: number | string, height: number | string,
    }
  } = { portrait: { width: 740, height: 300 }, landscape: { width: 1020, height: 300 } };
  @Input() public colors: string[] = ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0'];
  @Input() public labelColour: string = '#000000';
  @Input() public strokeColour: string = '#FFFFFF';
  @Input() public averageColour: string = '#FF0000';

  public dataValues: ApexAxisChartSeries | ApexNonAxisChartSeries = [];
  public labels: string[] = [];
  public average: number = 0;
  public tickCount: number = null;
  public chart: ApexCharts = null;
  public chartOptions: ApexOptions;

  getChartType(): string {
    switch (this.chartType) {
      case 'pie':
        return '1Axis';
      case 'bar':
        return '2Axis';
    }
  }

  ngOnInit() {
    this.filterData();
    this.chartOptions = this.options;
  }

  async ngAfterViewInit() {
    this.chart = new ApexCharts(document.getElementById(this.chartId), this.options);
    await this.chart.render();
  }

  async ngOnChanges(changes: SimpleChanges)
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

  get options() {
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
        enabled: this.chartType !== 'bar',
        //styling for this label
        style: {
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, Roboto',
          fontSize: '18px',
          fontWeight: 'bold',
          colors: [this.labelColour],
        },
        //gives the label a background color
        background: {
          enabled: this.chartType !== 'bar',
        },
        //disables drop shadow on the label
        dropShadow: {
          enabled: false,
        },
        //Applies an offset to the label for better positioning
        offsetY: this.chartType === 'bar' ? -30 : 0,

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
          //border for the elements to give them a curved appearance
          borderRadius: 10,
          //determines whether the graph should render horizontally
          horizontal: this.horizontal,
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
   **/
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
  Returns the largest value in an array if that value is equal to or less than 5
   The purpose of this is to stop the chart's y-axis from attempting to draw numbers with decimal points, as we do
   not allow them.
   **/
  getTickCount(numbers: number[]) {
    const max = Math.max(...numbers)
    return max <= 5 ? max : null;
  }
}
