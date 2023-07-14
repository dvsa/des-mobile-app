import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AppModule } from '@app/app.module';
import { MotDetailsDisplay } from '@pages/waiting-room-to-car/components/mot-details-display/mot-details-display';

describe('MotDetailsDisplay', () => {
  let fixture: ComponentFixture<MotDetailsDisplay>;
  let component: MotDetailsDisplay;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        MotDetailsDisplay,
      ],
      imports: [
        IonicModule,
        AppModule,
      ],
    });

    fixture = TestBed.createComponent(MotDetailsDisplay);
    component = fixture.componentInstance;
  }));

  it('should create component', () => {
    expect(component)
      .toBeTruthy();
  });
});
