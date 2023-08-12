import { Component, Input } from '@angular/core';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';

@Component({
  selector: 'header-component',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss'],
})
export class HeaderComponent {

  @Input()
  id: string;

  @Input()
  headerNum: number;

  @Input()
  inheritWeight?: boolean = false;

  @Input()
  inheritColour?: boolean = false;

  @Input()
  inheritDisplay?: boolean = false;

  @Input()
  inheritFontSize?: boolean = false;

  @Input()
  allowTruncate?: boolean = false;

  constructor(
    public accessibilityService: AccessibilityService,
  ) {

  }

}