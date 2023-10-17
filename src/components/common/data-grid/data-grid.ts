import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'data-grid',
  templateUrl: 'data-grid.html',
  styleUrls: ['data-grid.scss'],
})
export class DataGridComponent implements OnInit {

  @Input() headers: any[] = null;
  @Input() passedData: any[] = null;
  @Input() rowCropCount: number = null;
  @Input() colourScheme: string[] = null;
  @Input() displayColour: boolean = false;

  public finalColourArray: string[] = null;
  public croppedRows: { preCrop: any[], postCrop: any[] } = null;
  public croppedColumns: { preCrop: any[], postCrop: any[] } = null;
  public showCroppedData: boolean = false;

  ngOnInit() {
    if ((this.rowCropCount && this.passedData) && this.croppedRows === null) {
      this.cropData();
    }
    if (this.colourScheme && !this.finalColourArray) {
      this.finalColourArray = this.loopColours();
    }
  }

  loopColours() {
    let tempArray: string[] = [];
    if (this.croppedRows) {
      let loopCount: number = Math.ceil((
        this.croppedRows.preCrop.length + this.croppedRows.postCrop.length
      ) / this.colourScheme.length);
      for (let i = 0; i < loopCount; i += 1) {
        tempArray.push.apply(tempArray, this.colourScheme);
      }
    } else {
      let loopCount: number = Math.ceil((
        this.passedData.length
      ) / this.colourScheme.length);
      for (let i = 0; i < loopCount; i += 1) {
        tempArray.push.apply(tempArray, this.colourScheme);
      }
    }
    return  tempArray;
  }

  cropData() {
    this.croppedRows = {
      preCrop: this.passedData.slice(0, this.rowCropCount),
      postCrop: this.passedData.slice(this.rowCropCount),
    };
  }
}
