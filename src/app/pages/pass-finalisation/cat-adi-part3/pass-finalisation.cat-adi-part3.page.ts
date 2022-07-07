import { Component, OnInit } from '@angular/core';
import {
  CommonPassFinalisationPageState, PassFinalisationPageComponent,
} from '@shared/classes/test-flow-base-pages/pass-finalisation/pass-finalisation-base-page';
import { FormGroup } from '@angular/forms';
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
    console.log(this.form);
  }

  ionViewWillEnter(): boolean {
    super.ionViewWillEnter();
    this.store$.dispatch(PassFinalisationViewDidEnter());
    return true;
  }

  onSubmit() {
  }

}
