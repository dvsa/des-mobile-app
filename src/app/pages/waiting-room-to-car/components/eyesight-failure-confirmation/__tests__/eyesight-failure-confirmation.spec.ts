import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { By } from '@angular/platform-browser';
import { StoreModule, Store } from '@ngrx/store';

import { StoreModel } from '@shared/models/store.model';
import { CAT_B } from '@pages/page-names.constants';
import { testsReducer } from '@store/tests/tests.reducer';
import { SetActivityCode } from '@store/tests/activity-code/activity-code.actions';
import { RouterMock } from '@mocks/index.mock';
import { Router } from '@angular/router';

import { ReactiveFormsModule } from '@angular/forms';
import { MockComponent } from 'ng-mocks';
import { HeaderComponent } from '@components/common/header-component/header.component';
import { EyesightFailureConfirmationComponent } from '../eyesight-failure-confirmation';

describe('EyesightFailureConfirmationComponent', () => {
  let fixture: ComponentFixture<EyesightFailureConfirmationComponent>;
  let component: EyesightFailureConfirmationComponent;
  let router: Router;
  let store$: Store<StoreModel>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        EyesightFailureConfirmationComponent,
        MockComponent(HeaderComponent),
      ],
      imports: [
        IonicModule,
        StoreModule.forRoot({
          tests: testsReducer,
        }),
        ReactiveFormsModule,
      ],
      providers: [
        { provide: Router, useClass: RouterMock },
        Store,
      ],
    });

    fixture = TestBed.createComponent(EyesightFailureConfirmationComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    store$ = TestBed.inject(Store);
    spyOn(store$, 'dispatch');
  }));

  describe('DOM', () => {
    it('should call the cancel function when cancel is pressed', () => {
      const cancelSpy = jasmine.createSpy('onCancel');
      component.cancelFn = cancelSpy;
      const cancelButton = fixture.debugElement.query(By.css('#cancel-eyesight-failure'));
      cancelButton.triggerEventHandler('click', null);
      expect(cancelSpy).toHaveBeenCalled();
    });
    it('should navigate to debrief when continue is pressed', () => {
      spyOn(router, 'navigate');
      const confirmButton = fixture.debugElement.query(By.css('#confirm-eyesight-failure'));
      component.nextPageOnFail = CAT_B.DEBRIEF_PAGE;
      confirmButton.triggerEventHandler('click', null);
      expect(router.navigate).toHaveBeenCalledWith([CAT_B.DEBRIEF_PAGE]);
    });
  });

  describe('Class', () => {
    describe('onContinue', () => {
      it('should dispatch an action to set the activity code to an eyesight failure', () => {
        component.onContinue();
        expect(store$.dispatch).toHaveBeenCalledWith(SetActivityCode('3'));
      });
    });
  });
});
