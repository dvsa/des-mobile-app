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
  shouldShowIndicator: boolean = false;

  @Input()
  shouldHaveSeperator: boolean = true;

  @Input()
  idPrefix?: string;
}
