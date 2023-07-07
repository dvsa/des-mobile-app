import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NetworkStateProvider } from '@providers/network-state/network-state';
import { NetworkStateProviderMock } from '@providers/network-state/__mocks__/network-state.mock';
import { Store, StoreModule } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { MotCardComponent } from '../mot-card.component';

describe('MotCardComponent', () => {
  let component: MotCardComponent;
  let fixture: ComponentFixture<MotCardComponent>;
  let store$: Store<StoreModel>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MotCardComponent],
      imports: [
        StoreModule.forRoot(),
        IonicModule.forRoot(),
      ],
      providers: [
        { provide: NetworkStateProvider, useClass: NetworkStateProviderMock },
        Store,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MotCardComponent);
    store$ = TestBed.inject(Store);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
