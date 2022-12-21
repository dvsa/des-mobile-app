import { Component, OnInit } from '@angular/core';
import { selectVersionNumber } from '@store/app-info/app-info.selectors';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';

interface UnunploadedTestsPageState {
  appVersion$: Observable<string>;
}

@Component({
  selector: 'unuploaded-tests',
  templateUrl: 'unuploaded-tests.page.html',
  styleUrls: ['unuploaded-tests.page.scss'],
})
export class UnuploadedTestsPage implements OnInit {

  pageState: UnunploadedTestsPageState;

  constructor(
    private store$: Store<StoreModel>,
  ) {
  }

  ngOnInit() {
    this.pageState = {
      appVersion$: this.store$.select(selectVersionNumber),
    };
  }

}
