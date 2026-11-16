import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TickIndicatorComponent } from '@components/common/tick-indicator/tick-indicator';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import { Store, StoreModule } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { ToggleLegalRequirement } from '@store/tests/test-data/common/test-requirements/test-requirements.actions';
import { LegalRequirements } from '@store/tests/test-data/test-data.constants';
import { testsReducer } from '@store/tests/tests.reducer';
import { MockComponent } from 'ng-mocks';
import { CompetencyButtonComponent } from '../../competency-button/competency-button';
import { LegalRequirementComponent } from '../legal-requirement';

describe('LegalRequirementComponent', () => {
  let fixture: ComponentFixture<LegalRequirementComponent>;
  let component: LegalRequirementComponent;
  let store$: Store<StoreModel>;
  let storeDispatchSpy: Mock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({ tests: testsReducer }),
        LegalRequirementComponent,
        MockComponent(CompetencyButtonComponent),
        MockComponent(TickIndicatorComponent),
      ],
    });

    fixture = TestBed.createComponent(LegalRequirementComponent);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    storeDispatchSpy = vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
  });

  describe('Class', () => {
    it('should dispatch a TOGGLE_NORMAL_START_1 action', () => {
      component.legalRequirement = LegalRequirements.normalStart1;
      component.toggleLegalRequirement();

      expect(storeDispatchSpy).toHaveBeenCalledWith(ToggleLegalRequirement(LegalRequirements.normalStart1));
    });

    it('should dispatch a TOGGLE_NORMAL_START_2 action', () => {
      component.legalRequirement = LegalRequirements.normalStart2;
      component.toggleLegalRequirement();

      expect(storeDispatchSpy).toHaveBeenCalledWith(ToggleLegalRequirement(LegalRequirements.normalStart2));
    });

    it('should dispatch a TOGGLE_ANGLED_START action', () => {
      component.legalRequirement = LegalRequirements.angledStart;
      component.toggleLegalRequirement();

      expect(storeDispatchSpy).toHaveBeenCalledWith(ToggleLegalRequirement(LegalRequirements.angledStart));
    });

    it('should dispatch a TOGGLE_HILL_START action', () => {
      component.legalRequirement = LegalRequirements.hillStart;
      component.toggleLegalRequirement();

      expect(storeDispatchSpy).toHaveBeenCalledWith(ToggleLegalRequirement(LegalRequirements.hillStart));
    });
  });

  describe('getLegalRequirementClass', () => {
    it("should return 'normal-start-class' if component.legalRequirement value contains 'normalStart'", () => {
      component.legalRequirement = LegalRequirements.normalStart1;

      expect(component.getLegalRequirementClass()).toEqual('normal-start-label');
    });

    it("should return 'label' if component.legalRequirement value does not contain 'normalStart'", () => {
      component.legalRequirement = LegalRequirements.uphillStart;

      expect(component.getLegalRequirementClass()).toEqual('label');
    });
  });
});
