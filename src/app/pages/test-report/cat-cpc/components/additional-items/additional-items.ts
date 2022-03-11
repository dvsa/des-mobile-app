import { Component, Input } from '@angular/core';

@Component({
  selector: 'additional-items',
  templateUrl: 'additional-items.html',
  styleUrls: ['additional-items.scss'],
})
export class AdditionalItemsComponent {

  @Input()
  additionalItems: string[];

  showAdditionalItems = (additionalItems: string[]): boolean => additionalItems.length > 0;

}
