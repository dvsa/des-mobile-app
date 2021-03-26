import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { configureTestSuite } from 'ng-bullet';
import { JournalNavigationComponent } from '../journal-navigation';

describe('JournalNavigationComponent', () => {
  let fixture: ComponentFixture<JournalNavigationComponent>;
  let component: JournalNavigationComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [JournalNavigationComponent],
      imports: [
        IonicModule,
      ],
    });
  });

  beforeEach(async(() => {
    fixture = TestBed.createComponent(JournalNavigationComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
