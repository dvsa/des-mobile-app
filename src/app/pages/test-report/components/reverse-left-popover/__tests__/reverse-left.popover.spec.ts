import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { IonicModule } from '@ionic/angular';
import { MockComponent } from 'ng-mocks';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { ManoeuvreCompetencies } from '@store/tests/test-data/test-data.constants';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { ReverseDiagramLinkComponent } from '../../reverse-diagram-link/reverse-diagram-link';
import { ManoeuvreCompetencyComponent }
  from '../../manoeuvre-competency/manoeuvre-competency';
import { ReverseLeftPopoverComponent } from '../reverse-left-popover';

describe('reverseLeftComponent', () => {
  let fixture: ComponentFixture<ReverseLeftPopoverComponent>;
  let component: ReverseLeftPopoverComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        ReverseLeftPopoverComponent,
        MockComponent(ManoeuvreCompetencyComponent),
        MockComponent(ReverseDiagramLinkComponent),
      ],
      imports: [
        IonicModule,
      ],
      providers: [
        FaultCountProvider,
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(ReverseLeftPopoverComponent);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    describe('getId', () => {
      it('should return reverseLeft-controlFault', () => {
        const result = component.getId(ManoeuvreCompetencies.controlFault);
        expect(result).toBe('reverseLeft-controlFault');
      });

      it('should return reverseLeft-observationFault', () => {
        const result = component.getId(ManoeuvreCompetencies.observationFault);
        expect(result).toBe('reverseLeft-observationFault');
      });
    });
    describe('shouldShowReverseDiagramLink', () => {
      const testCases = [
        { category: TestCategory.BE, outcome: true },
        { category: TestCategory.C, outcome: true },
        { category: TestCategory.C1, outcome: true },
        { category: TestCategory.C1E, outcome: true },
        { category: TestCategory.CE, outcome: true },
        { category: TestCategory.D, outcome: true },
        { category: TestCategory.D1, outcome: true },
        { category: TestCategory.DE, outcome: true },
        { category: TestCategory.D1E, outcome: true },
        { category: TestCategory.F, outcome: false },
        { category: TestCategory.G, outcome: false },
        { category: TestCategory.H, outcome: false },
        { category: TestCategory.K, outcome: false },
      ];

      testCases.forEach((testCase) => {
        it(`should return the correct result for a category ${testCase.category} test`, () => {
          component.testCategory = testCase.category;
          fixture.detectChanges();
          expect(component.shouldShowReverseDiagramLink()).toEqual(testCase.outcome);
        });
      });
    });
  });
});
