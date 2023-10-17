import { Component, Input } from '@angular/core';
import ApexCharts from 'apexcharts';
import {
  ApexAxisChartSeries,
  ApexNonAxisChartSeries,
  ApexOptions,
  ChartType,
} from 'ng-apexcharts/lib/model/apex-types';

@Component({
  selector: 'chart',
  templateUrl: 'chart.html',
  styleUrls: ['chart.scss'],

})
export class ChartComponent {
  @Input() public chartId: string;
  @Input() public chartType: ChartType = 'pie';

  @Input() public data: { item: string, count: number }[] = [];
  @Input() public showLegend: boolean = false;

  public colors: string[] = ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0'];

  public dataValues: ApexAxisChartSeries | ApexNonAxisChartSeries = [];
  public labels: string[] = [];
  public chart: ApexCharts = null;

  getChartType(): string {
    switch (this.chartType) {
      case 'donut':
      case 'pie':
        return '1Axis';
      case 'bar':
        return '2Axis';
    }
  }

  async ngAfterViewInit() {

    this.filterData();

    this.chart = new ApexCharts(document.getElementById(this.chartId), this.getOptions());
    await this.chart.render();
  }

  async ngOnChanges() {
    if (!!this.chart) {
      await this.chart.updateOptions(this.getOptions());
    }
  }

  getOptions() {
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
    } as ApexOptions;
  }

  filterData() {
    let tempValues = [];

    this.data.forEach((value) => {
      if (this.getChartType() === '1Axis') {
        this.labels.push(value.item);
        (this.dataValues as ApexNonAxisChartSeries).push(value.count);
      } else {
        this.labels.push(value.item);
        tempValues.push(value.count);
      }
    });

    if (this.getChartType() === '2Axis') {
      (this.dataValues as ApexAxisChartSeries) = [{ data: tempValues }];
    }
  }
}

