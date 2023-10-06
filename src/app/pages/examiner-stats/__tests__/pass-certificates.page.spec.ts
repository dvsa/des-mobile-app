import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { IonicModule } from '@ionic/angular';
import { PassCertificatedViewDidEnter } from '@pages/pass-certificates/pass-certificates.actions';
import { ExaminerStatsPage } from '../examiner-stats.page';

describe('PassCertificatesPage', () => {
  let component: ExaminerStatsPage;
  let fixture: ComponentFixture<ExaminerStatsPage>;
  let store$: MockStore;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ExaminerStatsPage],
      imports: [IonicModule],
      providers: [
        { provide: Store, useClass: MockStore },
        provideMockStore({ }),
      ],
    });
    fixture = TestBed.createComponent(ExaminerStatsPage);
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
