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
  @Input() public chartId: string;
  @Input() public chartType: ChartType = 'pie';
  @Input() public passedData: PassedData[] = null;
  @Input() public showLegend: boolean = false;
  @Input() public colors: string[] = ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0'];

  public dataValues: ApexAxisChartSeries | ApexNonAxisChartSeries = [];
  public labels: string[] = [];
  public chart: ApexCharts = null;

  getChartType(): string {
    switch (this.chartType) {
      case 'donut':
      case 'pie':
      case 'polarArea':
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
    if (!!this.chart && !isEqual(changes.passedData.currentValue, changes.passedData.previousValue)) {
      await this.chart.updateOptions(this.options);
    }
  }

  get options() {
    return {
      chart: {
        toolbar: {
          show: false,
        },
        animations: {
          enabled: false,
        },
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, Roboto',
        fontSize: '24px',
        foreColor: '#000000',
        width: 300,
        height: 300,
        type: this.chartType,
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '24px',
        },
      },
      colors: this.colors,
      series: this.dataValues,
      labels: this.labels,
      responsive: [
        {
          breakpoint: 1000,
          options: {
            legend: {
              show: this.showLegend,
              fontSize: '24px',
              position: 'bottom',
            },
          },
        },
      ],
      plotOptions: {
        bar: {
          distributed: true,
          dataLabels: {
            position: 'bottom',
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

