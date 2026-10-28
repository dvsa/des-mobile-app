import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonCol, IonGrid, IonRow } from '@ionic/angular';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { TickIndicatorComponent } from '../../../../../components/common/tick-indicator/tick-indicator';
import { DataRowListItem } from './data-list-with-row.model';

@Component({
  selector: 'data-row-with-list',
  templateUrl: 'data-row-with-list.html',
  styleUrls: ['data-row-with-list.scss'],
  imports: [IonRow, IonCol, IonGrid, NgClass, TickIndicatorComponent],
})
export class DataRowWithListComponent {
  @Input()
  label: string;

  @Input()
  shouldHaveSeperator = true;

  @Input()
  data: DataRowListItem[];

  constructor(public accessibilityService: AccessibilityService) {}
}
