import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { configureTestSuite } from 'ng-bullet';
import { TestCentreNameComponent } from '../test-centre-name';
import { TestCentre } from '../../../../../shared/models/test-centre-journal.model';

describe('TestCentreNameComponent', () => {
  let fixture: ComponentFixture<TestCentreNameComponent>;
  let component: TestCentreNameComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestCentreNameComponent,
      ],
      imports: [IonicModule],
    });
  });

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TestCentreNameComponent);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    describe('testCentreNames', () => {
      it('should concatenate all test centre names into a single string', () => {
        component.testCentres = [
          { name: 'Centre A' },
          { name: 'Centre B' },
          { name: 'Centre C' },
        ] as TestCentre[];
        expect(component.testCentreNames).toEqual('Centre A, Centre B, Centre C');
      });
    });
  });
});
