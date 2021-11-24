import { TestBed, waitForAsync, ComponentFixture } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { configureTestSuite } from 'ng-bullet';
import { AdditionalCandidateDetailsComponent } from '../additional-candidate-details';

describe('AdditionalCandidateDetailsComponent', () => {
  let fixture: ComponentFixture<AdditionalCandidateDetailsComponent>;
  let component: AdditionalCandidateDetailsComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        AdditionalCandidateDetailsComponent,
      ],
      imports: [IonicModule],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(AdditionalCandidateDetailsComponent);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    it('should create', () => {
      expect(component).toBeDefined();
    });
  });
});
