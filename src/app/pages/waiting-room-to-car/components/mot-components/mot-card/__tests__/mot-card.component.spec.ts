import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Store, StoreModule } from '@ngrx/store';
import { NetworkStateProviderMock } from '@providers/network-state/__mocks__/network-state.mock';
import { ConnectionStatus, NetworkStateProvider } from '@providers/network-state/network-state';
import { VehicleMOTDetails } from '@providers/vehicle-details-api/vehicle-details-api.model';
import { MotStatusCodes } from '@shared/models/mot-status-codes';
import { MotCardComponent } from '../mot-card.component';

describe('MotCardComponent', () => {
  let component: MotCardComponent;
  let fixture: ComponentFixture<MotCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MotCardComponent],
      imports: [StoreModule.forRoot(), IonicModule.forRoot()],
      providers: [{ provide: NetworkStateProvider, useClass: NetworkStateProviderMock }, Store],
    }).compileComponents();

    fixture = TestBed.createComponent(MotCardComponent);
    // store$ = TestBed.inject(Store);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('isValidMOT', () => {
    it('should return true if data.status is "Valid"', () => {
      component.data = { status: MotStatusCodes.VALID } as VehicleMOTDetails;
      expect(component.isValidMOT()).toBeTruthy();
    });
    it('should return false if data.status is not "Valid"', () => {
      component.data = { status: MotStatusCodes.NOT_VALID } as VehicleMOTDetails;
      expect(component.isValidMOT()).toBeFalsy();
    });
  });
  describe('callWasSuccessful', () => {
    it('should return true if status is 200, data.status is not "No details" and the app is online', () => {
      spyOn(component.networkState, 'getNetworkState').and.returnValue(ConnectionStatus.ONLINE);
      component.data = { status: MotStatusCodes.VALID } as VehicleMOTDetails;
      component.status = '200';
      expect(component.callWasSuccessful()).toBeTruthy();
    });
    it(
      'should return false if status is not 200 or Already Saved, data.status is ' +
        'not "No details" and the app is online',
      () => {
        spyOn(component.networkState, 'getNetworkState').and.returnValue(ConnectionStatus.ONLINE);
        component.data = { status: MotStatusCodes.VALID } as VehicleMOTDetails;
        component.status = '100';
        expect(component.callWasSuccessful()).toBeFalsy();
      }
    );
    it('should return false if status is 200, data.status is ' + '"No details" and the app is online', () => {
      spyOn(component.networkState, 'getNetworkState').and.returnValue(ConnectionStatus.ONLINE);
      component.data = { status: MotStatusCodes.NO_DETAILS } as VehicleMOTDetails;
      component.status = '200';
      expect(component.callWasSuccessful()).toBeFalsy();
    });
    it('should return false if status is 200, data.status is ' + 'not "No details" and the app is not online', () => {
      spyOn(component.networkState, 'getNetworkState').and.returnValue(ConnectionStatus.OFFLINE);
      component.data = { status: MotStatusCodes.NO_DETAILS } as VehicleMOTDetails;
      component.status = '200';
      expect(component.callWasSuccessful()).toBeFalsy();
    });
  });
  describe('evidenceRadioSelected', () => {
    it('should emit the passed value and set alternateEvidenceRadioCheck to its value', () => {
      component.alternateEvidenceRadioCheck = false;
      spyOn(component.alternateEvidenceChange, 'emit');
      component.evidenceRadioSelected(true);
      expect(component.alternateEvidenceChange.emit).toHaveBeenCalledWith(true);
      expect(component.alternateEvidenceRadioCheck).toEqual(true);
    });
  });
});
