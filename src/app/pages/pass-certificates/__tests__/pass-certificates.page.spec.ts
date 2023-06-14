import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockStore } from '@ngrx/store/testing';
import { PassCertificatesPage } from '../pass-certificates.page';

describe('PassCertificatesPage', () => {
  let component: PassCertificatesPage;
  let fixture: ComponentFixture<PassCertificatesPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PassCertificatesPage],
      providers: [
        { provide: Store, useClass: MockStore },
      ],
    });
    fixture = TestBed.createComponent(PassCertificatesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
