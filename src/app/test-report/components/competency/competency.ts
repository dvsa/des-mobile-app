import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-competency',
  templateUrl: 'competency.html',
})
export class CompetencyComponent {

  @Input()
  competency: string;

  isRemoveFaultMode = false;
  faultCount: number;
  isSeriousMode = false;
  hasSeriousFault = false;
  isDangerousMode = false;
  hasDangerousFault = false;
  isDelegated = false;

  allowRipple = true;

  constructor() {}

  onTap = () => {
    this.addOrRemoveFault(this.isDelegated);
  }

  onPress = () => {
    this.addOrRemoveFault(true);
  }

  canButtonRipple = (): void => {
    if (this.isRemoveFaultMode) {
      if (this.hasDangerousFault && this.isDangerousMode) {
        this.allowRipple = true;
        return;
      }

      if (this.hasSeriousFault && this.isSeriousMode) {
        this.allowRipple = true;
        return;
      }

      if (!this.isSeriousMode && !this.isDangerousMode && this.faultCount > 0) {
        this.allowRipple = true;
        return;
      }

      this.allowRipple = false;
      return;
    }

    if (this.hasDangerousFault) {
      this.allowRipple = false;
      return;
    }

    if (this.isDangerousMode) {
      this.allowRipple = true;
      return;
    }

    if (this.hasSeriousFault) {
      this.allowRipple = false;
      return;
    }

    if (this.isSeriousMode) {
      this.allowRipple = true;
      return;
    }

    this.allowRipple = true;
  }

  addOrRemoveFault = (wasPress: boolean = false): void => {
    if (this.isRemoveFaultMode) {
      this.removeFault();
    } else {
      this.addFault(wasPress);
    }
  }

  addFault = (wasPress: boolean): void => {
    if (this.hasDangerousFault) {
      return;
    }

    if (this.isDangerousMode) {
      // this.store$.dispatch(new AddDangerousFault(this.competency));
      // this.store$.dispatch(new ToggleDangerousFaultMode());
      return;
    }

    if (this.hasSeriousFault) {
      return;
    }

    if (this.isSeriousMode) {
      // this.store$.dispatch(new AddSeriousFault(this.competency));
      // this.store$.dispatch(new ToggleSeriousFaultMode());
      return;
    }

    if (wasPress) {
      const competency = this.competency;
      // return this.store$.dispatch(new ThrottleAddDrivingFault({
      //   competency,
      //   newFaultCount: this.faultCount ? this.faultCount + 1 : 1,
      // }));
    }
  }

  removeFault = (): void => {
    if (this.hasDangerousFault && this.isDangerousMode && this.isRemoveFaultMode) {
      // this.store$.dispatch(new RemoveDangerousFault(this.competency));
      // this.store$.dispatch(new ToggleDangerousFaultMode());
      // this.store$.dispatch(new ToggleRemoveFaultMode());
      return;
    }

    if (this.hasSeriousFault && this.isSeriousMode && this.isRemoveFaultMode) {
      // this.store$.dispatch(new RemoveSeriousFault(this.competency));
      // this.store$.dispatch(new ToggleSeriousFaultMode());
      // this.store$.dispatch(new ToggleRemoveFaultMode());
      return;
    }
    if (!this.isSeriousMode && !this.isDangerousMode && this.isRemoveFaultMode && this.faultCount > 0) {
      // this.store$.dispatch(new RemoveDrivingFault({
      //   competency: this.competency,
      //   newFaultCount: this.faultCount ? this.faultCount - 1 : 0,
      // }));
      // this.store$.dispatch(new ToggleRemoveFaultMode());
    }

  }

  competencyHasFault = (): boolean => {
    return this.hasDangerousFault || this.hasSeriousFault || this.hasDrivingFault();
  }

  hasDrivingFault = (): boolean => {
    return this.faultCount !== undefined;
  }
}
