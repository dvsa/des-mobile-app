import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ApplicationReferenceComponent } from '../application-reference';

describe('ApplicationReferenceComponent', () => {
  let component: ApplicationReferenceComponent;
  let fixture: ComponentFixture<ApplicationReferenceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplicationReferenceComponent],
      imports: [IonicModule],
    });

    fixture = TestBed.createComponent(ApplicationReferenceComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
