import { Component, Input, OnInit } from '@angular/core';
import { isEqual } from 'lodash';

export type PassedData = [string, number, string];

@Component({
  selector: 'data-grid',
  templateUrl: 'data-grid.html',
  styleUrls: ['data-grid.scss'],
})
export class DataGridComponent implements OnInit {

  @Input() headers: string[] = null;
  @Input() passedData: unknown[][] = null;
  @Input() rowCropCount: number = null;
  @Input() colourScheme: string[] = null;
  @Input() displayColour: boolean = false;
  @Input() showSeparator: boolean = true;
  @Input() showHeaders: boolean = true;

  public finalColourArray: string[] = null;
  public croppedRows: { preCrop: unknown[], postCrop: unknown[] } = null;
  public showCroppedData: boolean = false;

  ngOnInit() {
    if ((this.rowCropCount && this.passedData) && this.croppedRows === null) {
      this.cropData();
    }
    if (this.colourScheme && !this.finalColourArray) {
      this.finalColourArray = this.loopColours();
    }
  }

  ngOnChanges(changes) {

    const dataChanged = Object.keys(changes)
      .some((key) => !isEqual(changes[key]?.currentValue, changes[key]?.previousValue));

    if (dataChanged) {
      if (this.rowCropCount && this.passedData) {
        this.cropData();
      }
      if (this.colourScheme && !this.finalColourArray) {
        this.finalColourArray = this.loopColours();
      }
    }
  }

  loopColours() {
    const loopCount = !!(this.rowCropCount)
      ? Math.ceil((this.croppedRows.preCrop.length + this.croppedRows.postCrop.length) / this.colourScheme.length)
      : Math.ceil((this.passedData.length) / this.colourScheme.length);

    return Array(loopCount)
      .fill(() => null)
      .map(() => this.colourScheme)
      .flat();
  }

  trackByIndex = (index: number) => index;

  cropData() {
    this.croppedRows = {
      preCrop: this.passedData.slice(0, this.rowCropCount),
      postCrop: this.passedData.slice(this.rowCropCount),
    };
  }
}
