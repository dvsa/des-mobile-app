import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { LicencePhoto } from '@pages/candidate-licence/components/licence-photo/licence-photo';

describe('LicencePhoto', () => {
  let fixture: ComponentFixture<LicencePhoto>;
  let component: LicencePhoto;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LicencePhoto],
      imports: [IonicModule],
    });

    fixture = TestBed.createComponent(LicencePhoto);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });
});
