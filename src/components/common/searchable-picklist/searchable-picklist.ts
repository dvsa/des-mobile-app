import {
  Component, EventEmitter, Input, Output,
} from '@angular/core';
import { get } from 'lodash';
import { ModalController } from '@ionic/angular';

export enum SearchablePicklistModalEvent {
  CANCEL = 'cancel',
  SUBMIT = 'submit',
}

@Component({
  selector: 'searchable-picklist',
  templateUrl: './searchable-picklist.html',
  styleUrls: ['./searchable-picklist.scss'],
})
export class SearchablePicklistComponent<T> {

  @Input()
  dataList: T[] = [];

  @Input()
  model: T;

  @Input()
  fieldLabel: string;

  @Input()
  key: string;

  @Input()
  minCharactersBeforeListDisplay: number = 0;

  @Input()
  displayKey: string;

  @Input()
  placeholder: string = 'Please enter a value';

  @Input()
  idPrefix: string = 'searchable-picklist';

  @Output()
  outputChanged = new EventEmitter<T>();

  searchedValue: string;

  constructor(private modalController: ModalController) {}

  onCancel = async (): Promise<void> => {
    await this.modalController.dismiss(null, SearchablePicklistModalEvent.CANCEL);
  };

  onSubmit = async (): Promise<void> => {
    this.outputChanged.emit(this.model);
    await this.modalController.dismiss(this.model, SearchablePicklistModalEvent.SUBMIT);
  };

  isActiveSelection = (data: T): boolean => (get(data, this.key) === get(this.model, this.key));

  trackBy = (_: any, data: T) => get(data, this.key, null);

  conditionalStyles = (data: T) => ({
    selected: this.isActiveSelection(data),
    'button-style': true,
  });

  get hasEnteredSufficientCharacters(): boolean {
    return (this.searchedValue?.length || 0) >= this.minCharactersBeforeListDisplay;
  }

  onSearchbarChange(event: CustomEvent): void {
    this.searchedValue = event?.detail?.value;
  }

  onClick = (data: T): void => {
    this.model = data;
  };

  clearInput = (): void => {
    this.searchedValue = null;
    this.model = null;
  };
}
