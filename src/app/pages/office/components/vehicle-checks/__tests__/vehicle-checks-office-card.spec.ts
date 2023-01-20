import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { VehicleChecksOfficeCardComponent } from '@pages/office/components/vehicle-checks/vehicle-checks-office-card';

describe('VehicleChecksOfficeCardComponent', () => {
  let fixture: ComponentFixture<VehicleChecksOfficeCardComponent>;
  let component: VehicleChecksOfficeCardComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [VehicleChecksOfficeCardComponent],
      imports: [
        IonicModule,
      ],
    });

    fixture = TestBed.createComponent(VehicleChecksOfficeCardComponent);
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
