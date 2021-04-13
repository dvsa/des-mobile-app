import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RekeyUploadOutcomePage } from '../rekey-upload-outcome.page';

describe('RekeyUploadOutcomePage', () => {
  let component: RekeyUploadOutcomePage;
  let fixture: ComponentFixture<RekeyUploadOutcomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RekeyUploadOutcomePage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(RekeyUploadOutcomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
