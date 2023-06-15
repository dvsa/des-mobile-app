import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PassCertificatesPage } from '../pass-certificates.page';

describe('PassCertificatesPage', () => {
  let component: PassCertificatesPage;
  let fixture: ComponentFixture<PassCertificatesPage>;
  let store$: MockStore;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PassCertificatesPage],
      providers: [
        { provide: Store, useClass: MockStore },
        provideMockStore({ }),
      ],
    });
    fixture = TestBed.createComponent(PassCertificatesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    store$ = TestBed.inject(MockStore);
  }));
  it('should create', () => {
    expect(component).toBeTruthy();
    expect(store$).toBeTruthy();
  });
});
