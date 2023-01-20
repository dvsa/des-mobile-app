import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { DataRowCustomComponent } from '@components/common/data-row-custom/data-row-custom';

describe('DataRowCustomComponent', () => {
  let fixture: ComponentFixture<DataRowCustomComponent>;
  let component: DataRowCustomComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        IonicModule,
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
