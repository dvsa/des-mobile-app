import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicencePhoto } from '@pages/candidate-licence/components/licence-photo/licence-photo';

describe('LicencePhoto', () => {
  let fixture: ComponentFixture<LicencePhoto>;
  let component: LicencePhoto;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LicencePhoto],
    });

    fixture = TestBed.createComponent(LicencePhoto);
    component = fixture.componentInstance;
  });

  describe('Class', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });
});
