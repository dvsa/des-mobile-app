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
  @Input() public monochrome: boolean = false;
  @Input() public transformOptions: { width: number, height: number } = { width: 300, height: 300 };
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
    const dataChanged = Object.keys(changes)
      .some((key) => !isEqual(changes[key]?.currentValue, changes[key]?.previousValue));

    if (!!this.chart && dataChanged) {
      this.filterData();

      if (Object.keys(changes).includes('chartType')) {
        this.chart = new ApexCharts(document.getElementById(this.chartId), this.options);
        await this.chart.render();
      } else {}
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
        width: this.transformOptions.width,
        height: this.transformOptions.height,
        type: this.chartType,
      },
      dataLabels: {
        enabled: true,
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
      },
      xaxis: {
        labels: {
          formatter: (val) => val,
        },
      },
      yaxis: {
        labels: {
          formatter: (val) => val.toFixed(0),
        },
      },
      theme: {
        monochrome: {
          enabled: this.monochrome,
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
              position: 'left',
            },
          },
        },
      ],
      plotOptions: {
        bar: {
          distributed: true,
          horizontal: false,
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

