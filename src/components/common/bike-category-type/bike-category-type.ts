import {
  Component, OnChanges, Input, ViewChild, Output, EventEmitter,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { IonSelect } from '@ionic/angular';
import { BikeCategoryDetailProvider } from '@providers/bike-category-detail/bike-category-detail';
import {
  BikeCategoryDetail,
  BikeTestType,
} from '@providers/bike-category-detail/bike-category-detail.model';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { StoreModel } from '@shared/models/store.model';
import * as waitingRoomToCarActions from '@pages/waiting-room-to-car/waiting-room-to-car.actions';

@Component({
  selector: 'bike-category-type',
  templateUrl: './bike-category-type.html',
  styleUrls: ['./bike-category-type.scss'],
})
export class BikeCategoryTypeComponent implements OnChanges {

  @ViewChild('categorySelect') selectRef: IonSelect;

  @Input()
  formGroup: FormGroup;

  @Input()
  testCategory: CategoryCode;

  @Input()
  testType: BikeTestType;

  @Input()
  categoryConfirmed?: boolean = false;

  @Output()
  categoryCodeChange = new EventEmitter<CategoryCode>();

  formControl: FormControl;
  bikeCategoryDetails: BikeCategoryDetail[];

  constructor(
    public bikeCategoryDetailProvider: BikeCategoryDetailProvider,
    public store$: Store<StoreModel>,
  ) { }

  async openCategorySelector(): Promise<void> {
    this.loadImages();
    await this.selectRef.open();
  }

  loadImages(): void {
    setTimeout(() => {
      const options = document.getElementsByClassName('alert-radio-label');
      Array.from(options).forEach((option, index) => {
        const element = options[index];
        const category = this.bikeCategoryDetails[index].categoryCode;
        const bike = this.bikeCategoryDetailProvider.getDetailByCategoryCode(category);
        element.innerHTML = `<span class="bike-code">${element.innerHTML}</span>`
          .concat(`${bike.displayName}<img class="bike-image" src="${bike.imageUrl}" />`);
      });
    }, 20);
  }

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl({
        value: 'Select cat type..',
        disabled: false,
      },
      [this.validateCategorySelection.bind(this)]);
      this.formGroup.addControl('categoryTypeSelectCategory', this.formControl);
    }
    this.formControl.patchValue('Select cat type..');

  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

  ngOnInit(): void {
    // default to MOD1 if any input other than MOD1 or MOD2 provided
    this.testType = (this.testType === BikeTestType.MOD1 || this.testType === BikeTestType.MOD2)
      ? this.testType : BikeTestType.MOD1;
    this.bikeCategoryDetails = this.bikeCategoryDetailProvider.getAllDetailsByTestType(this.testType);
  }

  bikeCategoryModalShown(): void {
    this.store$.dispatch(waitingRoomToCarActions.WaitingRoomToCarViewBikeCategoryModal());
  }

  categoryCodeChanged(category: CategoryCode): void {
    this.categoryConfirmed = true;
    this.ngOnChanges();
    this.categoryCodeChange.emit(category);
  }

  validateCategorySelection(): null | { categoryTypeSelectCategory: boolean } {
    return this.categoryConfirmed ? null : { categoryTypeSelectCategory: false };
  }

}
