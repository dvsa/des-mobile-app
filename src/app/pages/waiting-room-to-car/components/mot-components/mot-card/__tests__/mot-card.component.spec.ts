import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MotHistory, MotStatusCodes } from '@dvsa/mes-mot-schema';
import { Store, StoreModule } from '@ngrx/store';
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
      expect(component.isValidMOT()).toBeTruthy();
    });
    it('should return false if data.status is not "Valid"', () => {
      component.data = { status: MotStatusCodes.NOT_VALID } as MotHistory;
      expect(component.isValidMOT()).toBeFalsy();
    });
  });
  describe('callWasSuccessful', () => {
    it('should return true if status is 200, data.status is not "No details" and the app is online', () => {
      spyOn(component.networkState, 'getNetworkState').and.returnValue(ConnectionStatus.ONLINE);
      component.data = { status: MotStatusCodes.VALID } as MotHistory;
      component.status = '200';
      expect(component.callWasSuccessful()).toBeTruthy();
    });
    it(
      'should return false if status is not 200 or Already Saved, data.status is ' +
        'not "No details" and the app is online',
      () => {
        spyOn(component.networkState, 'getNetworkState').and.returnValue(ConnectionStatus.ONLINE);
        component.data = { status: MotStatusCodes.VALID } as MotHistory;
        component.status = '100';
        expect(component.callWasSuccessful()).toBeFalsy();
      }
    );
    it('should return false if status is 200, data.status is ' + '"No details" and the app is online', () => {
      spyOn(component.networkState, 'getNetworkState').and.returnValue(ConnectionStatus.ONLINE);
      component.data = { status: MotStatusCodes.NO_DETAILS } as MotHistory;
      component.status = '200';
      expect(component.callWasSuccessful()).toBeFalsy();
    });
    it('should return false if status is 200, data.status is ' + 'not "No details" and the app is not online', () => {
      spyOn(component.networkState, 'getNetworkState').and.returnValue(ConnectionStatus.OFFLINE);
      component.data = { status: MotStatusCodes.NO_DETAILS } as MotHistory;
      component.status = '200';
      expect(component.callWasSuccessful()).toBeFalsy();
    });
  });
  describe('noDetails', () => {
    it('should return true if status is NO_CONTENT', () => {
      component.status = HttpStatusCodes.NO_CONTENT.toString();
      expect(component.noDetails()).toBeTruthy();
    });

    it('should return true if data.status is NO_DETAILS', () => {
      component.data = { status: MotStatusCodes.NO_DETAILS } as MotHistory;
      expect(component.noDetails()).toBeTruthy();
    });

    it('should return true if data.status is AGE_EXEMPTION', () => {
      component.data = { status: MotStatusCodes.AGE_EXEMPTION } as MotHistory;
      expect(component.noDetails()).toBeTruthy();
    });

    it('should return false if status and data.status do not match NO_CONTENT, NO_DETAILS, or AGE_EXEMPTION', () => {
      component.status = HttpStatusCodes.OK.toString();
      component.data = { status: MotStatusCodes.VALID } as MotHistory;
      expect(component.noDetails()).toBeFalsy();
    });
  });
  describe('is404', () => {
    it('should return true if status is NOT_FOUND', () => {
      component.status = HttpStatusCodes.NOT_FOUND.toString();
      expect(component.is404()).toBeTruthy();
    });

    it('should return false if status is not NOT_FOUND', () => {
      component.status = HttpStatusCodes.OK.toString();
      expect(component.is404()).toBeFalsy();
    });
  });
  describe('searchFailed', () => {
    it('should return true if status is UNDEFINED', () => {
      component.status = HttpStatusCodes.UNDEFINED.toString();
      expect(component.searchFailed()).toBeTruthy();
    });

    it('should return false if status is not UNDEFINED', () => {
      component.status = HttpStatusCodes.OK.toString();
      expect(component.searchFailed()).toBeFalsy();
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
