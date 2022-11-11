import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { MockComponent } from 'ng-mocks';
import { DataRowComponent } from '@components/common/data-row/data-row';
import { RekeyReasonCardComponent } from '../rekey-reason';

describe('RekeyReasonCardComponent', () => {
  let fixture: ComponentFixture<RekeyReasonCardComponent>;
  let component: RekeyReasonCardComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        RekeyReasonCardComponent,
        MockComponent(DataRowComponent),
      ],
      imports: [
        IonicModule,
      ],
    });

    fixture = TestBed.createComponent(RekeyReasonCardComponent);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    describe('getIPadIssue', () => {
      it('should return none if iPad Issue is not selected', () => {
        component.data = {
          ipadIssue: {
            selected: false,
          },
        };
        fixture.detectChanges();
        expect(component.iPadIssue).toEqual('None');
      });
      it('should return the correct value if the reason for rekey is due to the iPad being broken', () => {
        component.data = {
          ipadIssue: {
            selected: true,
            broken: true,
          },
        };
        fixture.detectChanges();
        expect(component.iPadIssue).toEqual('Broken');
      });
      it('should return the correct value if the reason for rekey is due to the iPad having a technical fault', () => {
        component.data = {
          ipadIssue: {
            selected: true,
            technicalFault: true,
          },
        };
        fixture.detectChanges();
        expect(component.iPadIssue).toEqual('Technical fault');
      });
      it('should return the correct value if the reason for rekey is due to the iPad being lost', () => {
        component.data = {
          ipadIssue: {
            selected: true,
            lost: true,
          },
        };
        fixture.detectChanges();
        expect(component.iPadIssue).toEqual('Lost');
      });
      it('should return the correct value if the reason for rekey is due to the iPad being stolen', () => {
        component.data = {
          ipadIssue: {
            selected: true,
            stolen: true,
          },
        };
        fixture.detectChanges();
        expect(component.iPadIssue).toEqual('Stolen');
      });
    });
    describe('getTransfer', () => {
      it('should return Yes if transfer is selected', () => {
        component.data = {
          transfer: {
            selected: true,
          },
        };
        fixture.detectChanges();
        expect(component.transfer).toEqual('Yes');
      });
      it('should return No if transfer is not selected', () => {
        component.data = {
          transfer: {
            selected: false,
          },
        };
        fixture.detectChanges();
        expect(component.transfer).toEqual('No');
      });
    });
    describe('getOther', () => {
      it('should show the reason if other is selected', () => {
        component.data = {
          other: {
            selected: true,
            reason: 'Other Reason',
          },
        };
        fixture.detectChanges();
        expect(component.other).toEqual('Other Reason');
      });
      it('should show N/A if other is not selected', () => {
        component.data = {
          other: {
            selected: false,
          },
        };
        fixture.detectChanges();
        expect(component.other).toEqual('N/A');
      });
    });
  });
});
