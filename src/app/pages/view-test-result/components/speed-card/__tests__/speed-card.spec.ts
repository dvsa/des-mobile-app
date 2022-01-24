import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { configureTestSuite } from 'ng-bullet';
import { SpeedCardComponent } from '@pages/view-test-result/components/speed-card/speed-card';

describe('SpeedCardComponent', () => {
  let fixture: ComponentFixture<SpeedCardComponent>;
  let component: SpeedCardComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        SpeedCardComponent,
      ],
      imports: [
        IonicModule,
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(SpeedCardComponent);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });
});
