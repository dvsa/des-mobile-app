import { Component, Input } from '@angular/core';

@Component({
  selector: 'data-row-custom',
  templateUrl: 'data-row-custom.html',
  styleUrls: ['data-row-custom.scss'],
})
export class DataRowCustomComponent {

  @Input()
  label: string;

  @Input()
  shouldShowIndicator: boolean = false;

  @Input()
  shouldHaveSeperator: boolean = true;

  @Input()
  idPrefix?: string;

  @Input()
  centeredLabel: boolean = true;

  @Input()
  centredData: boolean = false;
}
