import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CandidateDetailsPage } from './candidate-details.page';

describe('CandidateDetailsPage', () => {
  let component: CandidateDetailsPage;
  let fixture: ComponentFixture<CandidateDetailsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CandidateDetailsPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
