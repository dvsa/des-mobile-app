import { Component, Input } from '@angular/core';

@Component({
  selector: 'data-row',
  templateUrl: 'data-row.html',
  styleUrls: ['data-row.scss'],
})
export class DataRowComponent {

  @Input()
  label: string;

  @Input()
  dataStyling?: string;

  @Input()
  imgSrc: string;

  @Input()
  label2: string = null;

  @Input()
  value: string | number | boolean;

  @Input()
  shouldShowIndicator: boolean = false;

  @Input()
  shouldHaveSeperator: boolean = true;

  @Input()
  idPrefix?: string;
}
