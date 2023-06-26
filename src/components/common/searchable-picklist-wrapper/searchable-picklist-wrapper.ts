import {
  Component, EventEmitter, Input, Output,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SearchablePicklistModal } from '@components/common/searchable-picklist-modal/searchable-picklist-modal';
import { TestCentre } from '@dvsa/mes-journal-schema';
import { AppConfigProvider } from '@providers/app-config/app-config';

export enum SearchablePicklistModalEvent {
  CANCEL = 'cancel',
  SUBMIT = 'submit',
}

@Component({
  selector: 'searchable-picklist-wrapper',
  templateUrl: './searchable-picklist-wrapper.html',
  styleUrls: ['./searchable-picklist-wrapper.scss'],
})
export class SearchablePicklistComponentWrapper<T> {

  @Input()
  dataList: T[] = [];

  @Input()
  model: T;

  @Input()
  inputType: 'Candidate' | 'Test Centre';

  @Input()
  isAdvancedSearch: boolean = false;

  @Input()
  fieldLabel: string;

  @Input()
  fuzzySearchKeys: (keyof T)[] = []; // Keys in the model in which the fuzzy search will be run against;

  @Input()
  primaryKey: keyof T; // Property of the model (typically unique like an ID) to save or use as comparator;

  @Input()
  displayKey: string; // Property of the model to display in UI;

  @Input()
  minCharactersBeforeListDisplay: number = 0;

  @Input()
  placeholder: string = 'Please enter a value';

  @Input()
  idPrefix: string;

  @Input()
  differentDisplay: boolean = false;

  @Input()
  disabled: boolean = false;

  @Input()
  customWidth: number;

  @Output()
  outputChanged = new EventEmitter<T>();

  searchedValue: string;

  fakeTestCentres: TestCentre[] = [
    { centreId: 54321, centreName: 'Example test centre', costCode: 'EXTC1' },
    { centreId: 54322, centreName: 'Example test centre 2', costCode: 'EXTC2' },
    { centreId: 90876, centreName: 'Inactive test centre 1', costCode: 'INAC1' },
    { centreId: 65432, centreName: 'Inactive test centre 2', costCode: 'INAC2' },
  ];

  constructor(
    private modalController: ModalController,
    private appConfig: AppConfigProvider,
  ) {}

  async openModal(): Promise<void> {
    // Don't create new modal if disabled property is set or a modal already exists;
    if (this.disabled || await this.modalController.getTop()) {
      return;
    }

    const modal: HTMLIonModalElement = await this.modalController.create({
      component: SearchablePicklistModal,
      componentProps: {
        dataList: this.appConfig.isDebugMode && this.inputType === 'Test Centre' ? this.fakeTestCentres : this.dataList,
        model: this.model,
        fuzzySearchKeys: this.fuzzySearchKeys,
        minCharactersBeforeListDisplay: this.minCharactersBeforeListDisplay,
        primaryKey: this.primaryKey,
        displayKey: this.displayKey,
        idPrefix: this.idPrefix,
        placeholder: this.placeholder,
      },
    });
    await modal.present();

    const { data } = await modal.onWillDismiss<T>();

    // Define emitter so the calling components can listen out for data changes
    this.outputChanged.emit(data);
  }

  clearInput(): void {
    this.model = null;
    this.searchedValue = null;
    this.outputChanged.emit('' as T);
  }
}
