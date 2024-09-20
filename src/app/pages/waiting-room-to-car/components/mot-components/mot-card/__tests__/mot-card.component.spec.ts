import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Store, StoreModule } from '@ngrx/store';
import { MotHistory, MotStatusCodes } from '@providers/mot-history-api/mot-interfaces';
import { NetworkStateProviderMock } from '@providers/network-state/__mocks__/network-state.mock';
import { ConnectionStatus, NetworkStateProvider } from '@providers/network-state/network-state';
import { HttpStatusCodes } from '@shared/models/http-status-codes';
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
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('isValidMOT', () => {
    it('should return true if data.status is "Valid"', () => {
      component.data = { status: MotStatusCodes.VALID } as MotHistory;
      expect(component.isValidMOT()).toEqual(true);
    });
    it('should return false if data.status is not "Valid"', () => {
      component.data = { status: MotStatusCodes.NOT_VALID } as MotHistory;
      expect(component.isValidMOT()).toEqual(false);
    });
  });

  describe('callWasSuccessful', () => {
    it('should return true if status is 200, data.status is not "No details" and the app is online', () => {
      spyOn(component.networkState, 'getNetworkState').and.returnValue(ConnectionStatus.ONLINE);
      component.data = { status: MotStatusCodes.VALID } as MotHistory;
      component.status = '200';
      expect(component.isCallSuccessful()).toEqual(true);
    });
    it(
      'should return false if status is not 200 or Already Saved, data.status is ' +
        'not "No details" and the app is online',
      () => {
        spyOn(component.networkState, 'getNetworkState').and.returnValue(ConnectionStatus.ONLINE);
        component.data = { status: MotStatusCodes.VALID } as MotHistory;
        component.status = '100';
        expect(component.isCallSuccessful()).toEqual(false);
      }
    );
    it('should return false if status is 200, data.status is ' + '"No details" and the app is online', () => {
      spyOn(component.networkState, 'getNetworkState').and.returnValue(ConnectionStatus.ONLINE);
      component.data = { status: MotStatusCodes.NO_DETAILS } as MotHistory;
      component.status = '200';
      expect(component.isCallSuccessful()).toBeFalsy();
    });
    it('should return false if status is 200, data.status is ' + 'not "No details" and the app is not online', () => {
      spyOn(component.networkState, 'getNetworkState').and.returnValue(ConnectionStatus.OFFLINE);
      component.data = { status: MotStatusCodes.NO_DETAILS } as MotHistory;
      component.status = '200';
      expect(component.isCallSuccessful()).toEqual(false);
    });
  });

  describe('isNoDetails', () => {
    it('should return true if status is NO_CONTENT', () => {
      component.status = HttpStatusCodes.NO_CONTENT.toString();
      expect(component.isNoDetails()).toEqual(true);
    });

    it('should return true if data.status is NO_DETAILS', () => {
      spyOn(component, 'is404').and.returnValue(false);
      spyOn(component, 'isSearchFailed').and.returnValue(false);
      component.data = { status: MotStatusCodes.NO_DETAILS } as MotHistory;
      expect(component.isNoDetails()).toEqual(true);
    });

    it('should return true if data.status is AGE_EXEMPTION', () => {
      spyOn(component, 'is404').and.returnValue(false);
      spyOn(component, 'isSearchFailed').and.returnValue(false);
      component.data = { status: MotStatusCodes.AGE_EXEMPTION } as MotHistory;
      expect(component.isNoDetails()).toEqual(true);
    });

    it('should return false if status and data.status do not match NO_CONTENT, NO_DETAILS, or AGE_EXEMPTION', () => {
      spyOn(component, 'is404').and.returnValue(false);
      spyOn(component, 'isSearchFailed').and.returnValue(false);
      component.status = HttpStatusCodes.OK.toString();
      component.data = { status: MotStatusCodes.VALID } as MotHistory;
      expect(component.isNoDetails()).toEqual(false);
    });

    it('should return true if status is equal to 404', () => {
      spyOn(component, 'is404').and.returnValue(true);
      spyOn(component, 'isSearchFailed').and.returnValue(false);
      component.status = HttpStatusCodes.NOT_FOUND.toString();
      component.data = { status: MotStatusCodes.VALID } as MotHistory;
      expect(component.isNoDetails()).toEqual(true);
    });

    it('should return true if searchFailed', () => {
      spyOn(component, 'is404').and.returnValue(false);
      spyOn(component, 'isSearchFailed').and.returnValue(true);
      component.status = HttpStatusCodes.NOT_FOUND.toString();
      component.data = { status: MotStatusCodes.VALID } as MotHistory;
      expect(component.isNoDetails()).toEqual(false);
    });
  });

  describe('is404', () => {
    it('should return true if status is NOT_FOUND', () => {
      component.status = HttpStatusCodes.NOT_FOUND.toString();
      expect(component.is404()).toEqual(true);
    });

    it('should return false if status is not NOT_FOUND', () => {
      component.status = HttpStatusCodes.OK.toString();
      expect(component.is404()).toEqual(false);
    });
  });
  describe('isSearchFailed', () => {
    it('should return true if status is UNDEFINED', () => {
      component.status = HttpStatusCodes.UNDEFINED.toString();
      expect(component.isSearchFailed()).toEqual(true);
    });

    it('should return true if status is INTERNAL_SERVER_ERROR', () => {
      component.status = HttpStatusCodes.INTERNAL_SERVER_ERROR.toString();
      expect(component.isSearchFailed()).toEqual(true);
    });

    it('should return true if status is BAD_GATEWAY', () => {
      component.status = HttpStatusCodes.BAD_GATEWAY.toString();
      expect(component.isSearchFailed()).toEqual(true);
    });

    it('should return true if status is SERVICE_UNAVAILABLE', () => {
      component.status = HttpStatusCodes.SERVICE_UNAVAILABLE.toString();
      expect(component.isSearchFailed()).toEqual(true);
    });

    it('should return true if status is GATEWAY_TIMEOUT', () => {
      component.status = HttpStatusCodes.GATEWAY_TIMEOUT.toString();
      expect(component.isSearchFailed()).toEqual(true);
    });

    it('should return false if status is a listed status code', () => {
      component.status = HttpStatusCodes.OK.toString();
      expect(component.isSearchFailed()).toEqual(false);
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
