import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PassCertificatesPage } from '../pass-certificates.page';

describe('PassCertificatesPage', () => {
  let component: PassCertificatesPage;
  let fixture: ComponentFixture<PassCertificatesPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PassCertificatesPage],
    });
    fixture = TestBed.createComponent(PassCertificatesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
