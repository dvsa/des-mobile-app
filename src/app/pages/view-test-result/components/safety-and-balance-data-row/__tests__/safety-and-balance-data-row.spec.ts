import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { SafetyAndBalanceDataRowComponent } from '../safety-and-balance-data-row';

describe('SafetyAndBalanceDataRowComponent', () => {
  let fixture: ComponentFixture<SafetyAndBalanceDataRowComponent>;
  let component: SafetyAndBalanceDataRowComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SafetyAndBalanceDataRowComponent],
      imports: [IonicModule],
    });

    fixture = TestBed.createComponent(SafetyAndBalanceDataRowComponent);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    describe('shouldShowFault', () => {
      it('should return true if outcome is a DF', () => {
        expect(component.shouldShowFault('DF')).toEqual(true);
      });
      it('should return false if outcome is not a DF', () => {
        expect(component.shouldShowFault('P')).toEqual(false);
        expect(component.shouldShowFault('D')).toEqual(false);
        expect(component.shouldShowFault('S')).toEqual(false);
      });
    });
  });
});
