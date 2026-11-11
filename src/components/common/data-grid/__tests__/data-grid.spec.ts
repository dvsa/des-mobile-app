import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DataGridComponent } from '@components/common/data-grid/data-grid';

describe('DataGridComponent', () => {
  let fixture: ComponentFixture<DataGridComponent>;
  let component: DataGridComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DataGridComponent],
      providers: [],
    });

    fixture = TestBed.createComponent(DataGridComponent);
    component = fixture.componentInstance;
  });

  describe('ngOnChanges', () => {
    it('should set finalColourArray to loopColours if the changes include colourScheme', () => {
      vi.spyOn(component, 'loopColours').mockReturnValue(['1', '2']);

      component.finalColourArray = null;
      component.ngOnChanges({ colourScheme: null });

      expect(component.finalColourArray).toEqual(['1', '2']);
    });
    it('should set finalColourArray to loopColours if dataChanged is true', () => {
      vi.spyOn(component, 'loopColours').mockReturnValue(['1', '2']);

      component.finalColourArray = null;
      component.ngOnChanges({ data: { previousValue: '1', currentValue: '2' } as SimpleChange });

      expect(component.finalColourArray).toEqual(['1', '2']);
    });
  });
  describe('loopColours', () => {
    it(
      'should loop the colour array once if there ' + 'is more rows in the data grid than items in the colour array',
      () => {
        component.passedData = [[1], [2], [3], [4], [5], [6]];
        component.colourScheme = ['1', '2', '3', '4'];

        expect(component.loopColours()).toEqual(['1', '2', '3', '4', '1', '2', '3', '4']);
      }
    );
  });
});
