import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import {
  VehicleChecksOfficeCardCatADI2Component,
} from '@pages/office/cat-adi-part2/components/vehicle-checks/vehicle-checks-office-card';
import { CompetencyOutcome } from '@shared/models/competency-outcome';

describe('VehicleChecksOfficeCardCatADI2Component', () => {
  let fixture: ComponentFixture<VehicleChecksOfficeCardCatADI2Component>;
  let component: VehicleChecksOfficeCardCatADI2Component;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [VehicleChecksOfficeCardCatADI2Component],
      imports: [
        IonicModule,
      ],
    });

    fixture = TestBed.createComponent(VehicleChecksOfficeCardCatADI2Component);
    component = fixture.componentInstance;
  }));

  describe('ngOnInit', () => {
    it('should return a list of outcomes when using question results', () => {
      component.checks = [{
        description: 'test',
        outcome: CompetencyOutcome.D,
      }, {
        description: 'test',
        outcome: CompetencyOutcome.P,
      }];
      component.ngOnInit();
      expect(component.checks).toEqual([{ description: 'test', outcome: 'D' },
        { description: 'test', outcome: 'P' }]);
    });
  });
  describe('questionHasFault', () => {
    it('should return true if the result passed is not CompetencyOutcome.P', () => {
      expect(component.questionHasFault({})).toBe(true);
    });
    it('should return false if the outcome of the result passed is not CompetencyOutcome.P', () => {
      expect(component.questionHasFault({ outcome: CompetencyOutcome.P })).toBe(false);
    });
  });
});
