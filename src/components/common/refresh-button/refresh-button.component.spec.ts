import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RefreshButtonComponent } from './refresh-button.component';

describe('RefreshButtonComponent', () => {
  let component: RefreshButtonComponent;
  let fixture: ComponentFixture<RefreshButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RefreshButtonComponent, IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(RefreshButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit refreshButtonClicked event when refreshClicked is called', () => {
    spyOn(component.refreshButtonClicked, 'emit');
    component.refreshClicked();
    expect(component.refreshButtonClicked.emit).toHaveBeenCalled();
  });
});
