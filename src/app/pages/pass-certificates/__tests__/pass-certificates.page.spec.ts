import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { IonicModule } from '@ionic/angular';
import { PassCertificatedViewDidEnter } from '@pages/pass-certificates/pass-certificates.actions';
import { PassCertificatesPage } from '../pass-certificates.page';

describe('PassCertificatesPage', () => {
  let component: PassCertificatesPage;
  let fixture: ComponentFixture<PassCertificatesPage>;
  let store$: MockStore;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PassCertificatesPage],
      imports: [IonicModule],
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

  describe('ionViewDidEnter', () => {
    it('should dispatch the store with PassCertificatedViewDidEnter', () => {
      spyOn(component.store$, 'dispatch');
      component.ionViewDidEnter();
      expect(component.store$.dispatch).toHaveBeenCalledWith(PassCertificatedViewDidEnter());
    });
  });
});
