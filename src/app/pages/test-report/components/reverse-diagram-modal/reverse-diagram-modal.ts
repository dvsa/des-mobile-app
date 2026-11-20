import { Component, Input } from '@angular/core';
import { Style } from '@capacitor/status-bar';
import { EmojiBlockDirective } from '@directives/emoji-block.directive';
import { InputRestrictionNumbersDirective } from '@directives/input-restriction-numbers.directive';
import { PasteSanitiserDirective } from '@directives/paste-sanitiser';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonLabel,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { Store } from '@ngrx/store';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { ReversingDistancesProvider } from '@providers/reversing-distances/reversing-distances';
import { VehicleDetailsByCategoryProvider } from '@providers/vehicle-details-by-category/vehicle-details-by-category';
import { StoreModel } from '@shared/models/store.model';
import { selectCurrentTest } from '@store/tests/tests.selector';
import { ReverseDiagramLengthChanged, ReverseDiagramWidthChanged } from './reverse-diagram-modal.actions';

type OnCloseFunc = () => void;

@Component({
  selector: 'reverse-diagram-modal',
  templateUrl: 'reverse-diagram-modal.html',
  styleUrls: ['reverse-diagram-modal.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonLabel,
    IonTitle,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    InputRestrictionNumbersDirective,
    EmojiBlockDirective,
    PasteSanitiserDirective,
  ],
})
export class ReverseDiagramPage {
  @Input()
  vehicleLength: number;

  @Input()
  onClose: OnCloseFunc;

  @Input()
  vehicleWidth: number;

  @Input()
  isPracticeMode: boolean;

  private readonly currentTest = this.store$.selectSignal(selectCurrentTest);
  reversingLengthStart: number;
  reversingLengthMiddle: number;
  reversingWidth: number;
  multiplierText: string;
  category: TestCategory;

  constructor(
    public store$: Store<StoreModel>,
    public accessibilityService: AccessibilityService,
    public reversingDistancesProvider: ReversingDistancesProvider,
    public vehicleDetailsProvider: VehicleDetailsByCategoryProvider
  ) {}

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
        return (this.multiplierText = '1 1/2');
      default:
        return (this.multiplierText = '2');
    }
  }

  ionViewWillEnter(): boolean {
    const test = this.currentTest();
    if (test?.category) {
      this.category = test.category as TestCategory;
      const selectors = this.vehicleDetailsProvider.getVehicleDetailsByCategoryCode(this.category);
      this.vehicleLength = selectors.vehicleLength(test.vehicleDetails);
      this.vehicleWidth = selectors.vehicleWidth(test.vehicleDetails);
      this.calculateReversingLengths(this.vehicleLength);
      this.calculateReversingWidth(this.vehicleWidth);
      this.calculateAtoBMultiplierText();
    }

    return true;
  }

  async closeModal() {
    if (this.isPracticeMode) {
      await this.accessibilityService.configureStatusBar(Style.Light);
    }
    await this.onClose();
  }

  onLengthKeyup(vehicleLength: number): void {
    this.store$.dispatch(ReverseDiagramLengthChanged(this.vehicleLength, vehicleLength));
    this.calculateReversingLengths(vehicleLength);
  }

  onWidthKeyup(vehicleWidth: number): void {
    this.store$.dispatch(ReverseDiagramWidthChanged(this.vehicleWidth, vehicleWidth));
    this.calculateReversingWidth(vehicleWidth);
  }
}
