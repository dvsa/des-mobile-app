import { Component, Input } from '@angular/core';

@Component({
  selector: 'data-row-custom',
  templateUrl: 'data-row-custom.html',
})
export class DataRowCustomComponent {

  @Input()
  label: string;

  @Input()
  shouldShowIndicator: boolean = false;

  @Input()
  shouldHaveSeperator: boolean = true;
}
