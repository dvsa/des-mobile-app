import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AppModule } from '@app/app.module';
import { DataGridComponent } from '@components/common/data-grid/data-grid';
import { SimpleChange } from '@angular/core';

describe('DataGridComponent', () => {
  let fixture: ComponentFixture<DataGridComponent>;
  let component: DataGridComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        DataGridComponent,
      ],
      imports: [
        IonicModule,
        AppModule,
      ],
      providers: [],
    });

    fixture = TestBed.createComponent(DataGridComponent);
    component = fixture.componentInstance;
  }));

  describe('ngOnInit', () => {
    it('should call cropData if croppedRows is null and ' +
      'rowCropCount && passedData are both present', () => {
      component.croppedRows = null;
      component.rowCropCount = 3;
      component.passedData = [[1], [2], [3], [4], [5], [6]];
      spyOn(component, 'cropData');

      component.ngOnInit();

      expect(component.cropData).toHaveBeenCalled();
    });
    it('should call loopColours if colourScheme is present and ' +
      'finalColourArray is not present', () => {
      component.croppedRows = null;
      component.rowCropCount = 3;
      component.passedData = [[1], [2], [3], [4], [5], [6]];

      component.colourScheme = ['1', '2', '3', '4'];
      component.finalColourArray = null;
      spyOn(component, 'loopColours');

      component.ngOnInit();

      expect(component.loopColours).toHaveBeenCalled();
    });
  });
  describe('ngOnChanges', () => {
    it('should set finalColourArray to loopColours if the changes include colourScheme', () => {
      spyOn(component, 'loopColours').and.returnValue(['1', '2']);

      component.finalColourArray = null;
      component.ngOnChanges({ colourScheme: null });

      expect(component.finalColourArray).toEqual(['1', '2']);
    });
    it('should set finalColourArray to loopColours if dataChanged is true', () => {

      spyOn(component, 'loopColours').and.returnValue(['1', '2']);

      component.finalColourArray = null;
      component.ngOnChanges({ data: { previousValue: '1', currentValue: '2' } as SimpleChange });

      expect(component.finalColourArray).toEqual(['1', '2']);
    });
    it('should run cropData if rowCropCount and passedData are present', () => {
      spyOn(component, 'loopColours').and.returnValue(['1', '2']);
      spyOn(component, 'cropData');

      component.rowCropCount = 1;
      component.passedData = [['1']];

      component.ngOnChanges({ data: { previousValue: '1', currentValue: '2' } as SimpleChange });

      expect(component.cropData).toHaveBeenCalled();
    });
  });
  describe('cropData', () => {
    it('should correctly crop an array into 2 depending on the parameter', () => {
      component.croppedRows = null;
      component.rowCropCount = 3;
      component.passedData = [[1], [2], [3], [4], [5], [6]];

      component.cropData();

      expect(component.croppedRows).toEqual({ preCrop: [[1], [2], [3]], postCrop: [[4], [5], [6]] });
    });
  });
  describe('loopColours', () => {
    it('should loop the colour array once if there ' +
      'is more rows in the data grid than items in the colour array', () => {
      component.passedData = [[1], [2], [3], [4], [5], [6]];
      component.colourScheme = ['1', '2', '3', '4'];

      expect(component.loopColours()).toEqual(['1', '2', '3', '4', '1', '2', '3', '4']);
    });
  });
  describe('trackByIndex', () => {
    it('should return passed indes', () => {
      expect(component.trackByIndex(1)).toEqual(1);
    });
  });

});
