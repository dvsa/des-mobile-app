import { NgClass, NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonCol, IonRow } from '@ionic/angular';
import { FormatIdPipe } from '@shared/pipes/format-id.pipe';

@Component({
  selector: 'data-row-custom',
  templateUrl: 'data-row-custom.html',
  styleUrls: ['data-row-custom.scss'],
  imports: [IonRow, NgClass, IonCol, NgStyle, FormatIdPipe],
})
export class DataRowCustomComponent {
  @Input()
  label: string;

  @Input()
  shouldShowIndicator = false;

  @Input()
  shouldHaveSeperator = true;

  @Input()
  idPrefix?: string;

  @Input()
  centeredLabel = true;

  @Input()
  customLabelStyling: { [p: string]: string | number } = null;

  @Input()
  centeredIcon = true;

  @Input()
  centredData = false;
}
