import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { testsReducer } from '@store/tests/tests.reducer';
import { StoreModule, Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { ToggleETA } from '@store/tests/test-data/common/eta/eta.actions';
import { ExaminerActions } from '@store/tests/test-data/test-data.constants';
import { MockComponent } from 'ng-mocks';
import { CompetencyButtonComponent } from '../../competency-button/competency-button';
import { EtaComponent } from '../eta';

describe('EtaComponent', () => {
  let fixture: ComponentFixture<EtaComponent>;
  let component: EtaComponent;
  let store$: Store<StoreModel>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        EtaComponent,
        MockComponent(CompetencyButtonComponent),
      ],
      imports: [
        IonicModule,
        StoreModule.forRoot({ tests: testsReducer }),
      ],
    });

    fixture = TestBed.createComponent(EtaComponent);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    spyOn(store$, 'dispatch');
  }));

  describe('Class', () => {
    it('should dispatch a TOGGLE_ETA_VERBAL action', () => {
      component.eta = ExaminerActions.verbal;
      component.toggleETA();
      expect(store$.dispatch).toHaveBeenCalledWith(ToggleETA(ExaminerActions.verbal));
    });

    it('should dispatch a TOGGLE_ETA_PHYSICAL action', () => {
      component.eta = ExaminerActions.physical;
      component.toggleETA();
      expect(store$.dispatch).toHaveBeenCalledWith(ToggleETA(ExaminerActions.physical));
    });
  });
});
