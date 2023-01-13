import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavParams } from '@ionic/angular';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { NavParamsMock } from '@mocks/angular-mocks/nav-params.mock';
import { DataRowCustomComponent } from '@components/common/data-row-custom/data-row-custom';

describe('DataRowCustomComponent', () => {
  let fixture: ComponentFixture<DataRowCustomComponent>;
  let component: DataRowCustomComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        IonicModule,
      ],
      providers: [
        { provide: OutcomeBehaviourMapProvider, useClass: OutcomeBehaviourMapProvider },
        { provide: NavParams, useClass: NavParamsMock },
      ],
    });

    fixture = TestBed.createComponent(DataRowCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  describe('constructor', () => {
    it('should set shouldShowIndicator to false by default', () => {
      expect(component.shouldShowIndicator).toBe(false);
    });
    it('should set shouldHaveSeperator to false by default', () => {
      expect(component.shouldHaveSeperator).toBe(true);
    });
  });
});
