import { Component, Input } from '@angular/core';

@Component({
  selector: 'data-row',
  templateUrl: 'data-row.html',
})
export class DataRowComponent {
  @Input()
  label: string;

  @Input()
  dataStyling?: string;

  @Input()
  imgSrc: string;

  @Input()
  value: string | number | boolean;

  @Input()
  shouldShowIndicator = false;

  @Input()
  shouldHaveSeperator = true;

  @Input()
  idPrefix?: string;
}
