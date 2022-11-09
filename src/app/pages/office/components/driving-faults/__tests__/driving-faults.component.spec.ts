import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { OfficeComponentsModule } from '@pages/office/components/office.components.module';
import { By } from '@angular/platform-browser';
import { FaultSummary } from '@shared/models/fault-marking.model';
import { DrivingFaultsComponent } from '../driving-faults.component';

fdescribe('DrivingFaultsComponent', () => {
  let component: DrivingFaultsComponent;
  let fixture: ComponentFixture<DrivingFaultsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DrivingFaultsComponent],
      imports: [IonicModule, OfficeComponentsModule],
    });

    fixture = TestBed.createComponent(DrivingFaultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('DOM', () => {
    const drivingFaults: FaultSummary[] = [
      {
        competencyIdentifier: 'signalsTimed',
        competencyDisplayName: 'Signals - Timed',
        faultCount: 3,
        comment: 'dummy',
      },
      {
        competencyIdentifier: 'useOfSpeed',
        competencyDisplayName: 'Use of speed',
        faultCount: 1,
        comment: 'dummy',
      },
    ];
    describe('Driving Faults Overview', () => {
      it('should display a driving faults badge with the count for each type of driving fault on the test', () => {
        fixture.detectChanges();
        component.faults = drivingFaults;
        fixture.detectChanges();
        const drivingFaultBadges = fixture.debugElement.queryAll(By.css('driving-faults-badge'));
        expect(drivingFaultBadges.length).toBe(2);
        expect(drivingFaultBadges[0].componentInstance.count).toBe(3);
        expect(drivingFaultBadges[1].componentInstance.count).toBe(1);
      });
      it('should render the display name for each driving fault', () => {
        fixture.detectChanges();
        component.faults = drivingFaults;
        fixture.detectChanges();
        const faultLabels = fixture.debugElement.queryAll(By.css('.fault-label'));
        expect(faultLabels.length).toBe(2);
        expect(faultLabels[0].nativeElement.innerHTML).toBe('Signals - Timed');
        expect(faultLabels[1].nativeElement.innerHTML).toBe('Use of speed');
      });
    });
  });
});
