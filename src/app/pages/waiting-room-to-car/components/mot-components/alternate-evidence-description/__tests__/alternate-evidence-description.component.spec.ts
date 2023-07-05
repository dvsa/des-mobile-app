import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AlternateEvidenceDescriptionComponent } from '../alternate-evidence-description.component';

describe('AlternateEvidenceDescriptionComponent', () => {
  let component: AlternateEvidenceDescriptionComponent;
  let fixture: ComponentFixture<AlternateEvidenceDescriptionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AlternateEvidenceDescriptionComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(AlternateEvidenceDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
