import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import ApexCharts from 'apexcharts';
import { ApexAxisChartSeries, ApexNonAxisChartSeries, ApexOptions, ChartType } from 'ng-apexcharts';
import { isEqual } from 'lodash';
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
  @Input() public transformOptions: { portrait: {
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

  async ngOnChanges(changes: SimpleChanges) {
    const dataChanged = Object.keys(changes)
      .some((key) => !isEqual(changes[key]?.currentValue, changes[key]?.previousValue));

    if (!!this.chart && dataChanged) {
      this.filterData();

      if (Object.keys(changes).includes('chartType')) {
        this.chart = new ApexCharts(document.getElementById(this.chartId), this.options);
        await this.chart.render();
      } else {
      }
      await this.chart.updateOptions(this.options);
    }
  }

  get options() {
    return {
      states: {
        //disable chart section darkening on click if the chart is a pie
        active: {
          filter: {
            type: this.chartType === 'pie' ? 'none' : 'darken',
            value: 0.6,
          },
        },
      },
      annotations: {
        //draw a line across the y-axis depicting the average value
        yaxis: [
          {
            y: this.average,
            borderColor: this.averageColour,
            borderWidth: 4,
            strokeDashArray: 4,
          },
        ],
      },
      fill: { opacity: 1 },
      chart: {
        toolbar: {
          show: false,
        },
        animations: {
          enabled: false,
        },
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, Roboto',
        fontSize: '24px',
        foreColor: this.labelColour,
        width: this.isPortrait ? this.transformOptions.portrait.width : this.transformOptions.landscape.width,
        height: this.isPortrait ? this.transformOptions.portrait.height : this.transformOptions.landscape.height,
        type: this.chartType,
      },
      dataLabels: {
        enabled: this.chartType !== 'bar',
        style: {
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, Roboto',
          fontSize: '18px',
          fontWeight: 'bold',
          colors: [this.labelColour],
        },
        background: {
          enabled: this.chartType !== 'bar',
        },
        dropShadow: {
          enabled: false,
        },
        offsetY: this.chartType === 'bar' ? -30 : 0,
        formatter: (val, opts) => {
          if (this.chartType === 'bar') {
            return val;
          }
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
      stroke: { show: true, colors: [this.strokeColour] },
      xaxis: {
        //disable the x-axis from darkening when the user clicks on it
        crosshairs: {
          show: false,
        },
        labels: {
          offsetY: this.horizontal ? 10 : 0,
          style: {
            fontSize: '24px',
            colors: this.labelColour,
          },
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
        labels: {
          offsetY: this.horizontal ? 7 : 6,
          style: {
            fontSize: '24px',
            colors: this.labelColour,
          },
          formatter: (val) => {
            if (this.horizontal) {
              return this.splitLabel ? val.toString().split(/[ ,]+/)[0] : val.toString();
            }
            return val.toFixed(0).toString();

          },
        },
      },
      colors: this.colors,
      series: this.dataValues,
      labels: this.labels,
      legend: {
        show: this.showLegend,
      },
      tooltip: {
        followCursor: false,
        enabled: this.chartType === 'bar',
        custom: function ({ series, seriesIndex, dataPointIndex, w }) {
          return '<div class="ion-padding">' +
            '<ion-text class="mes-data">' +
            '' + w.globals.labels[dataPointIndex] + ': ' + series[seriesIndex][dataPointIndex] + '' +
            '</ion-text>' +
            '</div>';
        },
      },
      responsive: [
        {
          breakpoint: 1000,
          options: {
            legend: {
              show: this.showLegend,
              fontSize: '24px',
              position: 'left',
            },
          },
        },
      ],
      plotOptions: {
        bar: {
          borderRadius: 10,
          distributed: true,
          horizontal: this.horizontal,
          dataLabels: {
            position: 'top',
          },
        },
        pie: {
          expandOnClick: false,
          donut: {
            labels: {
              show: this.chartType === 'donut',
              color: this.labelColour,
              total: {
                color: this.labelColour,
                show: this.chartType === 'donut',
                showAlways: this.chartType === 'donut',
              },
            },
          },
        },
      },
    } as ApexOptions;
  }

  filterData() {
    this.labels = this.passedData.map((val) => val.item);
    const values: number[] = this.passedData.map((val) => val.count);
    this.average = ((values.reduce((a, b) => a + b, 0)) / values.length) || 0;

    this.dataValues = (this.getChartType() === '1Axis')
      ? values as ApexNonAxisChartSeries
      : [{ data: values }] as ApexAxisChartSeries;
  }
}

