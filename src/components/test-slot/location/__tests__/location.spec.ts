import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { configureTestSuite } from 'ng-bullet';
import { LocationComponent } from '../location';

describe('LocationComponent', () => {
  let component: LocationComponent;
  let fixture: ComponentFixture<LocationComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [LocationComponent],
      imports: [IonicModule],
      providers: [],
    });
  });

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LocationComponent);
    component = fixture.componentInstance;
    component.location = 'Example Test Centre';
  }));

  describe('DOM', () => {
    describe('location icon', () => {
      it('should display test centre name', () => {
        const locationEl: HTMLElement = fixture.debugElement.query(
          By.css('h3'),
        ).nativeElement;
        fixture.detectChanges();
        expect(locationEl.textContent).toBe('Example Test Centre');
      });
      it('should display a location icon', () => {
        const iconElement = fixture.debugElement.queryAll(
          By.css('ion-icon[name="location"]'),
        );
        fixture.detectChanges();
        expect(iconElement.length).toBe(1);
      });
    });
  });
});
