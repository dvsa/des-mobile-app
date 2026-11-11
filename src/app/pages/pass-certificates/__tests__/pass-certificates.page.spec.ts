import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PassCertificatedViewDidEnter } from '@pages/pass-certificates/pass-certificates.actions';
import { PassCertificatesPage } from '../pass-certificates.page';

describe('PassCertificatesPage', () => {
  let component: PassCertificatesPage;
  let fixture: ComponentFixture<PassCertificatesPage>;
  let store$: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PassCertificatesPage],
      providers: [{ provide: Store, useClass: MockStore }, provideMockStore({})],
    });
    fixture = TestBed.createComponent(PassCertificatesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    store$ = TestBed.inject(MockStore);
  });
  it('should create', () => {
    expect(component).toBeTruthy();
    expect(store$).toBeTruthy();
  });

  describe('ionViewDidEnter', () => {
    it('should dispatch the store with PassCertificatedViewDidEnter', () => {
      vi.spyOn(component.store$, 'dispatch').mockReturnValue(undefined);
      component.ionViewDidEnter();
      expect(component.store$.dispatch).toHaveBeenCalledWith(PassCertificatedViewDidEnter());
    });
  });
});
