import {Component, OnInit} from '@angular/core';
import {
  CommonPassFinalisationPageState, PassFinalisationPageComponent,
} from '@shared/classes/test-flow-base-pages/pass-finalisation/pass-finalisation-base-page';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  CandidateChoseToProceedWithTestInEnglish,
  CandidateChoseToProceedWithTestInWelsh,
} from '@store/tests/communication-preferences/communication-preferences.actions';
import { Platform } from '@ionic/angular';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { behaviourMap } from '@pages/office/office-behaviour-map.cat-adi-part2';
import { PassFinalisationViewDidEnter } from '@pages/pass-finalisation/pass-finalisation.actions';
import {
  D255No,
} from '@store/tests/test-summary/test-summary.actions';

type PassFinalisationPageState = CommonPassFinalisationPageState;

@Component({
  selector: 'pass-finalisation.cat-adi-part3.page',
  templateUrl: './pass-finalisation.cat-adi-part3.page.html',
  styleUrls: ['./pass-finalisation.cat-adi-part3.page.scss'],
})

export class PassFinalisationCatADIPart3Page extends PassFinalisationPageComponent implements OnInit {

  form: FormGroup;
  public isEndToEndPracticeMode: boolean;
  pageState: PassFinalisationPageState;
  adviceGiven: boolean = null;
  private formControl: FormControl;
  noAdviceCharsRemaining: number = null;

  constructor(
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
    store$: Store<StoreModel>,
    public routeByCat: RouteByCategoryProvider,
    private outcomeBehaviourProvider: OutcomeBehaviourMapProvider,
  ) {
    super(platform, authenticationProvider, router, store$);
    this.form = new FormGroup({});
    this.outcomeBehaviourProvider.setBehaviourMap(behaviourMap);
  }

  ngOnInit(): void {
    super.onInitialisation();

    this.pageState = {
      ...this.commonPageState,
    };

    // Dispatching this action as D255 is not present in ADI pt2, but it is a mandatory field in TARS
    this.store$.dispatch(D255No());
    this.allocateFormControl();
    console.log(this.form);
  }

  allocateFormControl() {
    if (!this.formControl) {
      this.formControl = new FormControl('', [Validators.required]);
      this.form.addControl('furtherDevelopment', this.formControl);
    }
  }

  furtherDevelopmentChanged(furtherDevelopment) {
    if (furtherDevelopment === 'further-development-yes') {
      this.adviceGiven = true;
    } else {
      this.adviceGiven = false;
    }
    console.log(this.adviceGiven);
  }

  ionViewWillEnter(): boolean {
    super.ionViewWillEnter();
    this.store$.dispatch(PassFinalisationViewDidEnter());
    return true;
  }

  onSubmit() {
    console.log('submit');
  }

  characterCountChanged(charactersRemaining: number) {
    this.noAdviceCharsRemaining = charactersRemaining;
  }

  charactersExceeded(): boolean {
    return this.noAdviceCharsRemaining < 0;
  }

  getCharacterCountText() {
    const characterString = Math.abs(this.noAdviceCharsRemaining) === 1 ? 'character' : 'characters';
    const endString = this.noAdviceCharsRemaining < 0 ? 'too many' : 'remaining';
    return `You have ${Math.abs(this.noAdviceCharsRemaining)} ${characterString} ${endString}`;
  }

  isWelshChanged(isWelsh: boolean) {
    this.store$.dispatch(
      isWelsh
        ? CandidateChoseToProceedWithTestInWelsh('Cymraeg')
        : CandidateChoseToProceedWithTestInEnglish('English'),
    );
  }

}
