import { Component, Input } from '@angular/core';
import { AppComponent } from '@app/app.component';

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
  zoom?: string;

  @Input()
  inheritWeight?: boolean = false;

  @Input()
  inheritColour?: boolean = false;

  @Input()
  inheritDisplay?: boolean = false;

  @Input()
  inheritFontSize?: boolean = false;

  constructor(
    public appComponent: AppComponent,
  ) {

  }

}
