import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AppModule } from 'src/app/app.module';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { behaviourMap } from '@pages/office/office-behaviour-map';
import { configureTestSuite } from 'ng-bullet';
import { RouteNumberComponent } from '../route-number';

describe('RouteNumberComponent', () => {
  let fixture: ComponentFixture<RouteNumberComponent>;
  let component: RouteNumberComponent;
  let behaviourMapProvider: OutcomeBehaviourMapProvider;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        RouteNumberComponent,
      ],
      imports: [
        IonicModule,
        AppModule,
      ],
      providers: [
        { provide: OutcomeBehaviourMapProvider, useClass: OutcomeBehaviourMapProvider },
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(RouteNumberComponent);
    behaviourMapProvider = TestBed.inject(OutcomeBehaviourMapProvider);
    behaviourMapProvider.setBehaviourMap(behaviourMap);
    component = fixture.componentInstance;
  }));

  describe('class', () => {
    it('should emit route number if 1 character', () => {
      spyOn(component.routeNumberChange, 'emit');
      const routeNumber = '7';
      component.routeNumberChanged(routeNumber);
      expect(component.routeNumberChange.emit).toHaveBeenCalledWith(Number.parseInt(routeNumber, 10));
    });

    it('should emit route number if 2 characters', () => {
      spyOn(component.routeNumberChange, 'emit');
      const routeNumber = '44';
      component.routeNumberChanged(routeNumber);
      expect(component.routeNumberChange.emit).toHaveBeenCalledWith(Number.parseInt(routeNumber, 10));
    });

    it('should emit no route number if not numeric', () => {
      spyOn(component.routeNumberChange, 'emit');
      const routeNumber = 'ABC123';
      component.routeNumberChanged(routeNumber);
      expect(component.routeNumberChange.emit).toHaveBeenCalledWith(null);
    });
  });
});
