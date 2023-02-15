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
  fuzzySearchKeys: string[] = []; // Keys in the model in which the fuzzy search will be run against;

  @Input()
  primaryKey: string; // Property of the model (typically unique like an ID) to save or use as comparator;

  @Input()
  displayKey: string; // Property of the model to display in UI;

  @Input()
  minCharactersBeforeListDisplay: number = 0;

  @Input()
  placeholder: string = 'Please enter a value';

  @Input()
  idPrefix: string = 'searchable-picklist';

  @Output()
  outputChanged = new EventEmitter<T>();

  searchedValue: string;

  constructor(private modalController: ModalController) {}

  isActiveSelection = (data: T): boolean => (get(data, this.primaryKey) === get(this.model, this.primaryKey));

  trackBy = (_: any, data: T) => get(data, this.primaryKey, null);

  conditionalStyles = (data: T) => ({
    selected: this.isActiveSelection(data),
    'button-style': true,
  });

  get hasEnteredSufficientCharacters(): boolean {
    return (this.searchedValue?.length || 0) >= this.minCharactersBeforeListDisplay;
  }

  onSearchbarChange(event: CustomEvent): void {
    const value = event?.detail?.value || '';

    if (value.trim().length === 0) {
      return;
    }
    this.searchedValue = event?.detail?.value;
  }

  onSearchbarClear(): void {
    // this.searchedValue = null;
    this.model = null;
  }

  onClick = async (data: T): Promise<void> => {
    this.outputChanged.emit(data);
    await this.modalController.dismiss(data, SearchablePicklistModalEvent.SUBMIT);
  };

  clearInput = (): void => {
    this.searchedValue = null;
    this.model = null;
  };
}
