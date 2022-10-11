import {
  Component, Output, EventEmitter, Input,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { VRNCaptureModal } from '@components/common/vrn-capture-modal/vrn-capture-modal';
import { StoreModel } from '@shared/models/store.model';
import { VehicleRegistrationChanged } from '@store/tests/vehicle-details/vehicle-details.actions';
import { FieldValidators, getRegistrationNumberValidator } from '@shared/constants/field-validators/field-validators';
import {
  VRNModalCancelled,
  VRNModalOpened,
  VRNModalSaved,
} from '@store/tests/candidate-section/candidate-section.actions';

@Component({
  selector: 'candidate-section',
  templateUrl: './candidate-section.html',
  styleUrls: ['./candidate-section.scss'],
})
export class CandidateSectionComponent {

  constructor(
    public modalController: ModalController,
    public store$: Store<StoreModel>,
  ) {
  }

  @Input()
  candidateName: string;

  @Input()
  candidateDriverNumber: string;

  @Input()
  showVRNButton: boolean;

  @Input()
  candidatePrnNumber: number;

  @Input()
  isStandardsCheck: boolean;

  @Output()
  continueClickEvent = new EventEmitter<boolean>();

  readonly registrationNumberValidator: FieldValidators = getRegistrationNumberValidator();

  vrnModal: HTMLIonModalElement;

  proceed(): void {
    this.continueClickEvent.emit(true);
  }

  async openVRNModal(): Promise<void> {
    this.store$.dispatch(VRNModalOpened());
    this.vrnModal = await this.modalController.create({
      id: 'VRNCaptureModal',
      component: VRNCaptureModal,
      backdropDismiss: false,
      showBackdrop: true,
      cssClass: 'mes-modal-alert text-zoom-regular',
    });
    await this.vrnModal.present();
    const { data } = await this.vrnModal.onDidDismiss();

    if (!data) {
      this.store$.dispatch(VRNModalCancelled());
      return;
    }
    if (data?.vehicleRegNumber) {
      this.store$.dispatch(VRNModalSaved());
      this.store$.dispatch(VehicleRegistrationChanged(data.vehicleRegNumber));
    }
  }
}
