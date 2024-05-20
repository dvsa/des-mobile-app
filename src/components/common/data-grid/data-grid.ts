import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { isEqual } from 'lodash-es';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';

export type PassedData = [string, number, string];

@Component({
  selector: 'data-grid',
  templateUrl: 'data-grid.html',
  styleUrls: ['data-grid.scss'],
})
export class DataGridComponent implements OnInit {

  @Input() headers: string[] = null;
  @Input() passedData: any[][] = null;
  @Input() rowCropCount: number = null;
  @Input() colourScheme: string[] = null;
  @Input() displayColour: boolean = false;
  @Input() showSeparator: boolean = true;
  @Input() showHeaders: boolean = true;
  @Input() padDataTable: boolean = false;

  public finalColourArray: string[] = null;
  public croppedRows: { preCrop: unknown[], postCrop: unknown[] } = null;
  public showCroppedData: boolean = false;

  constructor(public accessibilityService: AccessibilityService) {
  }

  ngOnInit() {
    if ((this.rowCropCount && this.passedData) && this.croppedRows === null) {
      this.cropData();
    }

    if (this.colourScheme && !this.finalColourArray) {
      this.finalColourArray = this.loopColours();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const dataChanged = Object.keys(changes)
      .some((key) => !isEqual(changes[key]?.currentValue, changes[key]?.previousValue));

    if (Object.keys(changes).includes('colourScheme') || dataChanged) {
      this.finalColourArray = this.loopColours();
    }

    if (dataChanged) {
      if (this.rowCropCount && this.passedData) {
        this.cropData();
      }
    }
  }

  /**
   * Loops the given colour scheme if there are more elements in the data than there are colours in the colour scheme
   */
  loopColours() {
    const loopCount = Math.ceil((this.passedData.length) / this.colourScheme.length);

    return Array(loopCount)
      .fill(() => null)
      .map(() => this.colourScheme)
      .flat();
  }

  trackByIndex = (index: number) => index;

  /**
   * Cuts data into 2 different arrays to support a "show more" view
   */
  cropData() {
    this.croppedRows = {
      preCrop: this.passedData.slice(0, this.rowCropCount),
      postCrop: this.passedData.slice(this.rowCropCount),
    };
  }
}
