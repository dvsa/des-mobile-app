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
  dataStyling?: { [p: string]: any } = null;

  @Input()
  rowStyling?: { [p: string]: any } = null;

  @Input()
  labelStyling?: { [p: string]: any } = null;

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

  @Input()
  centreData = false;

  @Input()
  customLabelWidth: number = null;
}
