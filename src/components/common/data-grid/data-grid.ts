import { Component, Input } from '@angular/core';

@Component({
  selector: 'data-grid',
  templateUrl: 'data-grid.html',
})
export class DataGridComponent {

  @Input()
  headers: any[] = [];

  @Input()
  passedData: any[] = [];
}
