import { Component, Input } from '@angular/core';

@Component({
  selector: 'data-grid',
  templateUrl: 'data-grid.html',
  styleUrls: ['data-grid.scss'],
})
export class DataGridComponent {

  @Input() headers: any[] = null;
  @Input() passedData: any[] = null;
  @Input() rowCropCount: number = null;
  @Input() rowIconColors: string[] = null;

  public croppedRows: { preCrop: any[], postCrop: any[] } = null;
  public croppedColumns: { preCrop: any[], postCrop: any[] } = null;
  public showCroppedData: boolean = false;

  ngOnInit() {
    this.cropData();
  }

  cropData() {
    if (this.rowCropCount && this.passedData) {
      this.croppedRows = {
        preCrop: this.passedData.slice(0, this.rowCropCount),
        postCrop: this.passedData.slice(this.rowCropCount),
      };
    }
  }
}
