import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  CandidateDetailNavigationComponent,
} from '@pages/candidate-details/components/candidate-detail-navigation/candidate-detail-navigation';
import { IonicModule } from '@ionic/angular';
import { MockComponent } from 'ng-mocks';
import { HeaderComponent } from '@components/common/header-component/header.component';

describe('CandidateDetailNavigationComponent', () => {
  let fixture: ComponentFixture<CandidateDetailNavigationComponent>;
  let component: CandidateDetailNavigationComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        CandidateDetailNavigationComponent,
        MockComponent(HeaderComponent),
      ],
      imports: [
        IonicModule,
      ],
    });

    fixture = TestBed.createComponent(CandidateDetailNavigationComponent);
    component = fixture.componentInstance;
  }));

  describe('onPreviousCandidateClick', () => {
    it('should emit previousCandidateClicked', () => {
      spyOn(component.previousCandidateClicked, 'emit');
      component.onPreviousCandidateClick();
      expect(component.previousCandidateClicked.emit).toHaveBeenCalled();
    });
  });
  describe('onNextCandidateClick', () => {
    it('should emit nextCandidateClicked', () => {
      spyOn(component.nextCandidateClicked, 'emit');
      component.onNextCandidateClick();
      expect(component.nextCandidateClicked.emit).toHaveBeenCalled();
    });
  });
});
