import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonCol, IonRow } from '@ionic/angular';

@Component({
  selector: 'conducted-language',
  templateUrl: 'conducted-language.html',
  styleUrls: ['conducted-language.scss'],
  imports: [IonRow, IonCol, NgClass],
})
export class ConductedLanguageComponent {
  @Input()
  welshIsSelected: boolean;

  @Input()
  englishIsSelected: boolean;

  @Input()
  shouldRender: boolean;

  @Output()
  welshTextSelect = new EventEmitter<void>();

  @Output()
  englishTextSelect = new EventEmitter<void>();

  welshTextSelected() {
    this.welshIsSelected = true;
    this.englishIsSelected = false;
    this.welshTextSelect.emit();
  }

  englishTextSelected() {
    this.englishIsSelected = true;
    this.welshIsSelected = false;
    this.englishTextSelect.emit();
  }
}
