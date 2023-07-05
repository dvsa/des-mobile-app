import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AlternateMotEvidenceComponent } from '../alternate-mot-evidence.component';

describe('AlternateMotEvidenceComponent', () => {
  let component: AlternateMotEvidenceComponent;
  let fixture: ComponentFixture<AlternateMotEvidenceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AlternateMotEvidenceComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(AlternateMotEvidenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
