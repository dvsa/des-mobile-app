import { Component, Input } from '@angular/core';

@Component({
  selector: 'tab',
  templateUrl: 'tab.html',
  styleUrls: ['tab.scss'],
})
export class TabComponent {
  @Input('tabTitle') title: string;
  @Input() active = false;
}
