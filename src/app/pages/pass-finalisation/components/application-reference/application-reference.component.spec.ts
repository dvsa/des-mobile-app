import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { configureTestSuite } from 'ng-bullet';
import { ApplicationReferenceComponent } from './application-reference.component';

describe('ApplicationReferenceComponent', () => {
  let component: ApplicationReferenceComponent;
  let fixture: ComponentFixture<ApplicationReferenceComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ApplicationReferenceComponent],
      imports: [IonicModule],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(ApplicationReferenceComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
