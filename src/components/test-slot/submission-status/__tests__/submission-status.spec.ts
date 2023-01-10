import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'; // ComponentFixture
import { IonicModule } from '@ionic/angular';
import { AppModule } from '@app/app.module';
import { SubmissionStatusComponent } from '../submission-status';

describe('PracticeTestModal', () => {
  let fixture: ComponentFixture<SubmissionStatusComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        SubmissionStatusComponent,
      ],
      imports: [
        AppModule,
        IonicModule,
      ],
    });

    fixture = TestBed.createComponent(SubmissionStatusComponent);
    component = fixture.componentInstance;
  }));
});
