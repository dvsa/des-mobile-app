import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import ApexCharts from 'apexcharts';
import { ApexAxisChartSeries, ApexNonAxisChartSeries, ApexOptions, ChartType } from 'ng-apexcharts';
import { isEqual } from 'lodash';
import { PassedData } from '@components/common/data-grid/data-grid';

@Component({
  selector: 'chart',
  templateUrl: 'chart.html',
  styleUrls: ['chart.scss'],
})
export class ChartComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() public chartId: string = '';
  @Input() public chartType: ChartType = 'pie';
  @Input() public passedData: PassedData[] = null;
  @Input() public showLegend: boolean = false;
  @Input() public horizontal: boolean = true;
  @Input() public splitLabel: boolean = true;
  @Input() public transformOptions: {
    width: number | string, height: number | string,
  } = { width: '100%', height: 'auto' };
  @Input() public colors: string[] = ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0'];
  @Input() public labelColour: string = '#000000';

  public dataValues: ApexAxisChartSeries | ApexNonAxisChartSeries = [];
  public labels: string[] = [];
  public chart: ApexCharts = null;

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
        active: {
          filter: {
            type: 'none',
            value: 1,
          },
        },
      },
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
        width: this.transformOptions.width,
        height: this.transformOptions.height,
        type: this.chartType,
      },
      dataLabels: {
        enabled: this.chartType !== 'bar',
        style: {
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, Roboto',
          fontSize: '18px',
          fontWeight: 'bold',
          colors: ['#000000'],
        },
        background: {
          enabled: true,
        },
        dropShadow: {
          enabled: false,
        },
        formatter: (val, opts) =>
          opts.w.globals.labels[opts.seriesIndex].split(/[ ,]+/)[0] + ':  ' + Number(val).toFixed(1) + '%',
      },
      xaxis: {
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
        labels: {
          offsetY: this.horizontal ? 7 : 0,
          style: {
            fontSize: '24px',
            colors: this.labelColour,
          },
          formatter: (val) => {
            if (this.horizontal) {
              return this.splitLabel ? val.toString().split(/[ ,]+/)[0] : val;
            }
            return val.toFixed(0);

          },
        },
      },
      colors: this.colors,
      series: this.dataValues,
      labels: this.labels,
      tooltip: {
        enabled: false,
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
          distributed: true,
          horizontal: this.horizontal,
          dataLabels: {
            position: 'bottom',
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
    this.labels = this.passedData.map(([label]) => label);

    const values: number[] = this.passedData.map(([, value]) => value);

    this.dataValues = (this.getChartType() === '1Axis')
      ? values as ApexNonAxisChartSeries
      : [{ data: values }] as ApexAxisChartSeries;
  }
}

