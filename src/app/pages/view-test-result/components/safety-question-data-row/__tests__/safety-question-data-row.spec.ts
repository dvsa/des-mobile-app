import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { SafetyDataRowComponent } from '../safety-question-data-row';

describe('SafetyDataRowComponent', () => {
  let fixture: ComponentFixture<SafetyDataRowComponent>;
  let component: SafetyDataRowComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        SafetyDataRowComponent,
      ],
      imports: [
        IonicModule,
      ],
    });

    fixture = TestBed.createComponent(SafetyDataRowComponent);
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
