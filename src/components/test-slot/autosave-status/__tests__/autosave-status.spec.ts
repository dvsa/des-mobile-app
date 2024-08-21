import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AutosaveStatusComponent } from '@components/test-slot/autosave-status/autosave-status';
import { IonicModule } from '@ionic/angular';

describe('AutosaveStatusComponent', () => {
  let component: AutosaveStatusComponent;
  let fixture: ComponentFixture<AutosaveStatusComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AutosaveStatusComponent],
      imports: [IonicModule],
    });

    fixture = TestBed.createComponent(AutosaveStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
