import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchablePicklistModalEvent } from '@components/common/searchable-picklist-wrapper/searchable-picklist-wrapper';
import { IonCol, IonContent, IonGrid, IonIcon, IonItem, IonSearchbar, ModalController } from '@ionic/angular';
import { ContainsPipe } from '@shared/pipes/contains.pipe';
import { FormatIdPipe } from '@shared/pipes/format-id.pipe';
import { get } from 'lodash-es';
import { EmojiBlockDirective } from '../../../directives/emoji-block.directive';
import { PasteSanitiserDirective } from '../../../directives/paste-sanitiser';

@Component({
  selector: 'searchable-picklist-modal',
  templateUrl: './searchable-picklist-modal.html',
  styleUrls: ['./searchable-picklist-modal.scss'],
  imports: [
    IonContent,
    IonGrid,
    IonSearchbar,
    EmojiBlockDirective,
    PasteSanitiserDirective,
    FormsModule,
    IonItem,
    IonCol,
    NgClass,
    IonIcon,
    FormatIdPipe,
    ContainsPipe,
  ],
})
export class SearchablePicklistModal<T> {
  @Input()
  dataList: T[] = [];

  @Input()
  model: T;

  @Input()
  fuzzySearchKeys: (keyof T)[] = []; // Keys in the model in which the fuzzy search will be run against;

  @Input()
  primaryKey: keyof T; // Property of the model (typically unique like an ID) to save or use as comparator;

  @Input()
  displayKey: string; // Property of the model to display in UI;

  @Input()
  minCharactersBeforeListDisplay = 0;

  @Input()
  placeholder = 'Please enter a value';

  @Input()
  idPrefix: string;

  searchedValue: string;

  constructor(private modalController: ModalController) {}

  isActiveSelection = (data: T): boolean => get(data, this.primaryKey) === get(this.model, this.primaryKey);

  trackBy = (_: unknown, data: T) => get(data, this.primaryKey, null);

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
    this.searchedValue = null;
  }

  async onClick(data: string): Promise<void> {
    await this.modalController.dismiss(data, SearchablePicklistModalEvent.SUBMIT);
  }
}
