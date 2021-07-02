import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { configureTestSuite } from 'ng-bullet';
import { TestCentreNameComponent } from '../test-centre-name';

describe('TestCentreNameComponent', () => {
  let fixture: ComponentFixture<TestCentreNameComponent>;
  let component: TestCentreNameComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestCentreNameComponent,
      ],
      imports: [IonicModule],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(TestCentreNameComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
