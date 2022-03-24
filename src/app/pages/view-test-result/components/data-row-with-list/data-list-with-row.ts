import { Component, Input } from '@angular/core';
import { DataRowListItem } from './data-list-with-row.model';

@Component({
  selector: 'data-row-with-list',
  templateUrl: 'data-row-with-list.html',
  styleUrls: ['data-row-with-list.scss'],
})
export class DataRowWithListComponent {

  @Input()
  label: string;

  @Input()
  data: DataRowListItem[];
}
