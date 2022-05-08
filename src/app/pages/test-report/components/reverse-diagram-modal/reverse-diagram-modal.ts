import { merge, Observable, Subscription } from 'rxjs';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { NavParams } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { ReversingDistancesProvider } from '@providers/reversing-distances/reversing-distances';
import { select, Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store//tests/tests.selector';
import { getTestCategory } from '@store//tests/category/category.reducer';
import { map } from 'rxjs/operators';
import {
  CategorySpecificVehicleDetails,
  VehicleDetailsByCategoryProvider,
} from '@providers/vehicle-details-by-category/vehicle-details-by-category';
import { ReverseDiagramLengthChanged, ReverseDiagramWidthChanged } from './reverse-diagram-modal.actions';

interface ReverseDiagramPageState {
  vehicleLength$: Observable<number>;
  vehicleWidth$: Observable<number>;
  category$: Observable<CategoryCode>;
}

type OnCloseFunc = () => void;

@Component({
  selector: 'reverse-diagram-modal',
  templateUrl: 'reverse-diagram-modal.html',
  styleUrls: ['reverse-diagram-modal.scss'],
})
export class ReverseDiagramPage implements OnInit {
  @Input()
  vehicleLength: number;

  @Input()
  vehicleWidth: number;

  componentState: ReverseDiagramPageState;
  subscription: Subscription;
  catSubscription: Subscription;
  merged$: Observable<number | CategoryCode>;
  reversingLengthStart: number;
  reversingLengthMiddle: number;
  reversingWidth: number;
  multiplierText: string;
  category: TestCategory;
  onClose: OnCloseFunc;
  vehicleDetails: CategorySpecificVehicleDetails;

  constructor(
    private navParams: NavParams,
    public store$: Store<StoreModel>,
    public reversingDistancesProvider: ReversingDistancesProvider,
    public vehicleDetailsProvider: VehicleDetailsByCategoryProvider,
  ) {
    this.onClose = this.navParams.get('onClose');
  }

  ngOnInit(): void {
    const currentTest$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
    );

    let category: TestCategory;
    this.catSubscription = currentTest$.pipe(select(getTestCategory)).subscribe((value) => {
      category = value as TestCategory;
      const vehicleDetails = this.vehicleDetailsProvider.getVehicleDetailsByCategoryCode(category);
      this.componentState = {
        vehicleLength$: currentTest$.pipe(
          select(vehicleDetails.vehicleDetails),
          select(vehicleDetails.vehicleLength),
        ),
        vehicleWidth$: currentTest$.pipe(
          select(vehicleDetails.vehicleDetails),
          select(vehicleDetails.vehicleWidth),
        ),
        category$: currentTest$.pipe(
          select(getTestCategory),
        ),
      };
    });

    const { vehicleLength$, vehicleWidth$, category$ } = this.componentState;

    this.merged$ = merge(
      vehicleLength$.pipe(map((val) => this.vehicleLength = val)),
      vehicleWidth$.pipe(map((val) => this.vehicleWidth = val)),
      category$.pipe(map((val) => this.category = val as TestCategory)),
    );
  }

  getReversingDiagramLabel = (): string => {
    switch (this.category) {
      case TestCategory.BE:
      case TestCategory.CEM:
      case TestCategory.C1EM:
      case TestCategory.DEM:
      case TestCategory.D1EM:
        return 'articulated';
      case TestCategory.CM:
      case TestCategory.C1M:
      case TestCategory.DM:
      case TestCategory.D1M:
        return 'rigid';
      default:
        return 'rigid';
    }
  };

  calculateReversingLengths(vehicleLength: number): void {
    const vehicleDetails = {
      vehicleLength,
      vehicleWidth: this.vehicleWidth,
    };

    const reversingLengths = this.reversingDistancesProvider.getDistanceLength(vehicleDetails, this.category);
    this.reversingLengthStart = reversingLengths.startDistance;
    this.reversingLengthMiddle = reversingLengths.middleDistance;
    this.vehicleLength = vehicleLength;
  }

  calculateReversingWidth(vehicleWidth: number): void {
    const vehicleDetails = {
      vehicleWidth,
      vehicleLength: this.vehicleLength,
    };

    this.reversingWidth = this.reversingDistancesProvider.getDistanceWidth(vehicleDetails, this.category);
    this.vehicleWidth = vehicleWidth;
  }

  calculateAtoBMultiplierText() {
    switch (this.category) {
      case TestCategory.CM:
      case TestCategory.C1M:
      case TestCategory.DM:
      case TestCategory.D1M:
        return this.multiplierText = '1 1/2';
      default:
        return this.multiplierText = '2';
    }
  }

  ionViewWillEnter(): boolean {
    if (this.merged$) {
      this.subscription = this.merged$.subscribe();
      this.calculateReversingLengths(this.vehicleLength);
      this.calculateReversingWidth(this.vehicleWidth);
      this.calculateAtoBMultiplierText();
    }

    return true;
  }

  ionViewDidLeave(): void {
    this.subscription?.unsubscribe();
    this.catSubscription?.unsubscribe();
  }

  async closeModal() {
    await this.onClose();
  }

  onLengthKeyup(vehicleLength: number) : void {
    this.store$.dispatch(ReverseDiagramLengthChanged(this.vehicleLength, vehicleLength));
    this.calculateReversingLengths(vehicleLength);
  }

  onWidthKeyup(vehicleWidth: number) : void {
    this.store$.dispatch(ReverseDiagramWidthChanged(this.vehicleWidth, vehicleWidth));
    this.calculateReversingWidth(vehicleWidth);
  }
}
