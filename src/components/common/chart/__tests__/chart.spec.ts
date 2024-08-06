import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ChartComponent } from '@components/common/chart/chart';
import { SimpleChange } from '@angular/core';
import { ApexOptions } from 'ng-apexcharts';

describe('ChartComponent', () => {
  let component: ChartComponent;
  let fixture: ComponentFixture<ChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ChartComponent],
      imports: [IonicModule],
      providers: [
      ],
    });
    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;
    component.passedData = [
      { item: 'Index2 - Label2', count: 2, percentage: '45' },
      { item: 'Index3 - Label3', count: 3, percentage: '50' },
    ];
    component.chartId = 'test';

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('filterData', () => {
    it('should set labels to an array of the item property within passed data', () => {
      component.filterData();
      expect(component.labels).toEqual(['Index2 - Label2', 'Index3 - Label3']);
    });
    it('should set values to an array of the count property within passed data', () => {
      component.filterData();
      expect(component.dataValues).toEqual([2, 3]);
    });
    it('should leave values as an array if getChartType returns 1Axis', () => {
      spyOn(component, 'getChartType').and.returnValue('1Axis');

      component.filterData();
      expect(component.dataValues).toEqual([2, 3]);
    });
    it('should move values into an object if getChartType returns 2Axis', () => {
      spyOn(component, 'getChartType').and.returnValue('2Axis');

      component.filterData();
      expect(component.dataValues).toEqual([{ data: [2, 3] }]);
    });
  });

  describe('getChartType', () => {
    it('should return 1Axis if chartType is pie', () => {
      component.chartType = 'pie';
      expect(component.getChartType()).toEqual('1Axis');
    });
    it('should return 2Axis if chartType is bar', () => {
      component.chartType = 'bar';
      expect(component.getChartType()).toEqual('2Axis');
    });
  });

  describe('options', () => {
    it('should set yaxis.labels.offsetY to 7 if horizontal is true', () => {
      component.chartType = 'bar';
      component.horizontal = true;
      if ('labels' in component.options.yaxis) {
        expect(component.options.yaxis.labels.offsetY).toEqual(7);
      }
    });
    it('should set yaxis.labels.offsetY to 6 if horizontal is false', () => {
      component.chartType = 'bar';
      component.horizontal = false;
      if ('labels' in component.options.yaxis) {
        expect(component.options.yaxis.labels.offsetY).toEqual(6);
      }
    });

    it('should set xaxis.labels.offsetY to 10 if horizontal is true', () => {
      component.chartType = 'bar';
      component.horizontal = true;
      expect(component.options.xaxis.labels.offsetY).toEqual(10);
    });
    it('should set xaxis.labels.offsetY to 0 if horizontal is false', () => {
      component.chartType = 'bar';
      component.horizontal = false;
      expect(component.options.xaxis.labels.offsetY).toEqual(0);
    });

    it('should return unformatted value if the type is bar', () => {
      component.chartType = 'bar';
      expect(component.options.dataLabels.formatter('1')).toEqual('1');
    });
    it('should return split value with calculated percentage if the type is not bar ' +
      'and both splitLabel and calculatePercentages are true', () => {
      component.chartType = 'pie';
      component.splitLabel = true;
      component.calculatePercentages = true;
      expect(component.options.dataLabels.formatter(2,
        {
          seriesIndex: 1,
          w: {
            globals: {
              labels: [ 'Index - Label', 'Index2 - Label2'],
            },
          },
        })).toEqual('Index2:  2.0%');
    });
    it('should return split value without calculated percentage if the type is not bar ' +
      'and both splitLabel is true and calculatePercentages is false', () => {
      component.chartType = 'pie';
      component.splitLabel = true;
      component.calculatePercentages = false;
      expect(component.options.dataLabels.formatter(2,
        {
          seriesIndex: 1,
          w: {
            globals: {
              labels: [ 'Index - Label', 'Index2 - Label2'],
            },
          },
        })).toEqual('Index2:  50');
    });
    it('should return split value with calculated percentage if the type is not bar ' +
      'and calculatePercentages is true and splitLabel is false', () => {
      component.chartType = 'pie';
      component.splitLabel = false;
      component.calculatePercentages = true;
      expect(component.options.dataLabels.formatter(2,
        {
          seriesIndex: 1,
          w: {
            globals: {
              labels: [ 'Index - Label', 'Index2 - Label2'],
            },
          },
        })).toEqual('Index2 - Label2:  2.0%');
    });
    it('should return split value without calculated percentage if the type is not bar ' +
      'and splitLabel and calculatePercentages are false', () => {
      component.chartType = 'pie';
      component.splitLabel = false;
      component.calculatePercentages = false;
      expect(component.options.dataLabels.formatter(2,
        {
          seriesIndex: 1,
          w: {
            globals: {
              labels: [ 'Index - Label', 'Index2 - Label2'],
            },
          },
        })).toEqual('Index2 - Label2:  50');
    });

    it('should return xaxis split value if horizontal is false and splitlabel is true', () => {
      component.horizontal = false;
      component.splitLabel = true;

      expect(component.options.xaxis.labels.formatter('test label')).toEqual('test');
    });
    it('should return xaxis split value if horizontal is false and splitlabel is false', () => {
      component.horizontal = false;
      component.splitLabel = false;
      expect(component.options.xaxis.labels.formatter('test label')).toEqual('test label');
    });
    it('should return xaxis value if horizontal is true', () => {
      component.horizontal = true;
      expect(component.options.xaxis.labels.formatter('2')).toEqual('2');
    });

    it('should return yaxis split value if horizontal is true and splitlabel is true', () => {
      component.chartType = 'bar';

      component.horizontal = true;
      component.splitLabel = true;

      if ('labels' in component.options.yaxis) {
        expect(component.options.yaxis.labels.formatter(1)).toEqual('1');
      }
    });
    it('should return yaxis split value if horizontal is true and splitlabel is false', () => {
      component.chartType = 'bar';

      component.horizontal = true;
      component.splitLabel = false;
      if ('labels' in component.options.yaxis) {
        expect(component.options.yaxis.labels.formatter(2)).toEqual('2');
      }
    });
    it('should return yaxis value if horizontal is false', () => {
      component.chartType = 'bar';

      component.horizontal = false;
      if ('labels' in component.options.yaxis) {
        expect(component.options.yaxis.labels.formatter(3)).toEqual('3');
      }
    });
  });

  describe('ngOnChanges', () => {
    it('should run filterData and updateOptions with options if dataChanged is true and chart is present', () => {
      component.chart = {
        updateOptions(options:any): void {
          return options;
        },
      } as ApexCharts;

      spyOn(component, 'filterData');
      spyOnProperty(component, 'options').and.returnValue({} as ApexOptions);
      spyOn(component.chart, 'updateOptions');

      component.ngOnChanges({ data: { previousValue: '1', currentValue: '2' } as SimpleChange });

      expect(component.filterData).toHaveBeenCalled();
      expect(component.chart.updateOptions).toHaveBeenCalledWith(component.options);
    });
    it('should reassign chart if dataChanged is true, chart is present and the changes include chartType', () => {
      component.chart = {
        updateOptions(options:any): void {
          return options;
        },
        render(): void {
          return;
        },
      } as ApexCharts;


      component.ngOnChanges({ chartType: { previousValue: '1', currentValue: '2' } as SimpleChange });

      expect(component.chart).not.toEqual({
        updateOptions(options:any): void {
          return options;
        },
        render(): void {
          return;
        },
      } as ApexCharts);
    });
  });

  describe('getTickCount', () => {
    it('should return the largest number in the passed array if it is equal to or less than 5', () => {
      expect(component.getTickCount([1,2,3,4])).toBe(4);
    });
    it('should return null if the largest number in the passed array if it is more than 5', () => {
      expect(component.getTickCount([1,2,3,6])).toBe(null);
    });
  })

  describe('getFontSize', () => {
    it('should return 16px if the font size is set to text-zoom-regular', () => {
      component.zoomSize = 'text-zoom-regular'
      expect(component.getFontSize()).toBe('16px');
    });
    it('should return 18px if the font size is set to text-zoom-large', () => {
      component.zoomSize = 'text-zoom-large'
      expect(component.getFontSize()).toBe('18px');
    });
    it('should return 20px if the font size is set to text-zoom-x-large', () => {
      component.zoomSize = 'text-zoom-x-large'
      expect(component.getFontSize()).toBe('20px');
    });
  })

});
