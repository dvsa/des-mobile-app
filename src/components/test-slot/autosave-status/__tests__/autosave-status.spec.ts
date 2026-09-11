import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AutosaveStatusComponent } from '@components/test-slot/autosave-status/autosave-status';


describe('AutosaveStatusComponent', () => {
  let component: AutosaveStatusComponent;
  let fixture: ComponentFixture<AutosaveStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AutosaveStatusComponent],

    });

    fixture = TestBed.createComponent(AutosaveStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
