import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { configureTestSuite } from 'ng-bullet';
import { AppModule } from '@app/app.module';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FurtherDevelopmentComponent } from '../further-development.component';

describe('FurtherDevelopmentComponent', () => {
  let component: FurtherDevelopmentComponent;
  let fixture: ComponentFixture<FurtherDevelopmentComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        FurtherDevelopmentComponent,
      ],
      imports: [
        IonicModule,
        AppModule,
        ReactiveFormsModule,
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(FurtherDevelopmentComponent);
    component = fixture.componentInstance;
    component.formGroup = new FormGroup({});
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
