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

  describe('onPreviousDayClick', () => {
    it('should emit previousDayClicked', () => {
      spyOn(component.previousDayClicked, 'emit');
      component.onPreviousDayClick();
      expect(component.previousDayClicked.emit).toHaveBeenCalled();
    });
  });

  describe('onNextDayClick', () => {
    it('should emit nextDayClicked', () => {
      spyOn(component.nextDayClicked, 'emit');
      component.onNextDayClick();
      expect(component.nextDayClicked.emit).toHaveBeenCalled();
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
