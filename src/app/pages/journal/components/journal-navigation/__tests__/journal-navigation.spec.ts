import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { JournalNavigationComponent } from '../journal-navigation';

describe('JournalNavigationComponent', () => {
  let fixture: ComponentFixture<JournalNavigationComponent>;
  let component: JournalNavigationComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [JournalNavigationComponent],
      imports: [
        IonicModule,
      ],
    });

    fixture = TestBed.createComponent(JournalNavigationComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
