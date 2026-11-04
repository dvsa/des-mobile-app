import { NgClass, NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonCol, IonRow } from '@ionic/angular';
import { FormatIdPipe } from '@shared/pipes/format-id.pipe';

@Component({
  selector: 'data-row',
  templateUrl: 'data-row.html',
  styleUrls: ['data-row.scss'],
  imports: [IonRow, NgStyle, NgClass, IonCol, FormatIdPipe],
})
export class DataRowComponent {
  @Input()
  label: string;

  @Input()
  dataStyling?: Partial<CSSStyleDeclaration> = null;

  @Input()
  rowStyling?: Partial<CSSStyleDeclaration> = null;

  @Input()
  labelStyling?: Partial<CSSStyleDeclaration> = null;

  @Input()
  imgSrc: string;

  @Input()
  value: string | number | boolean;

  @Input()
  shouldShowIndicator = false;

  @Input()
  shouldHaveSeparator = true;

  @Input()
  idPrefix?: string;

  @Input()
  centreData = false;

  @Input()
  customLabelWidth: string = null;
}
