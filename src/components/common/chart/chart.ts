import { Component, Input } from '@angular/core';
import ApexCharts from 'apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart, ApexLegend,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexTitleSubtitle,
} from 'ng-apexcharts';
import { ApexDataLabels } from 'ng-apexcharts/lib/model/apex-types';

export type ChartOptions = {
  series: ApexNonAxisChartSeries | ApexAxisChartSeries;
  chart: ApexChart;
  colors: string[];
  responsive: ApexResponsive[];
  title: ApexTitleSubtitle;
  labels: any;
  dataLabels: ApexDataLabels;
  legendData: ApexLegend;
};

@Component({
  selector: 'chart',
  templateUrl: 'chart.html',
  styleUrls: ['chart.scss'],

})
export class ChartComponent {
  @Input() public chartId: string;

  @Input() public data: { item: string, count: number }[] = [];
  @Input() public legendData: ApexLegend = { show: false };
  @Input() public chartConfig: ApexChart = {
    height: 350,
    width: 400,
    type: 'donut',
  };

  public chartOptions: Partial<ChartOptions>;
  public dataValues = [];
  public labels = [];

  ngOnInit() {

    this.filterData();
    let chart = new ApexCharts(
      document.getElementById(this.chartId),
      {
        chart: {
          width: 500,
          height: 500,
          type: 'pie',
        },
        dataLabels: {
          enabled: false,
        },
        series: [
          44, 55, 41, 64, 22, 43, 21,
        ],
        responsive: [
          {
            breakpoint: 1000,
            options: {
              legend: {
                position: 'bottom',
              },
            },
          },
        ],
      });
    chart.render();
  }

  filterData() {
    this.data.forEach((value) => {
      this.labels.push(value.item);
      this.dataValues.push(value.count);
    });

  }
}

