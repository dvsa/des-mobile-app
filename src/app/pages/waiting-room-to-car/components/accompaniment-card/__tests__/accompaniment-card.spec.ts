import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import {
  FormGroup, ReactiveFormsModule,
} from '@angular/forms';
import { configureTestSuite } from 'ng-bullet';
import { PipesModule } from '@shared/pipes/pipes.module';
import {
  AccompanimentCardComponent,
} from '@pages/waiting-room-to-car/components/accompaniment-card/accompaniment-card';
import { AppModule } from '@app/app.module';

describe('AccompanimentCardComponent', () => {
  let fixture: ComponentFixture<AccompanimentCardComponent>;
  let component: AccompanimentCardComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        AccompanimentCardComponent,
      ],
      imports: [
        IonicModule,
        AppModule,
        ReactiveFormsModule,
        PipesModule,
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(AccompanimentCardComponent);
    component = fixture.componentInstance;
    component.formGroup = new FormGroup({});
  }));

  describe('instructorAccompanimentChanged', () => {
    it('should emit', () => {
      spyOn(component.instructorAccompanimentChange, 'emit');
      component.instructorAccompanimentChanged();
      expect(component.instructorAccompanimentChange.emit)
        .toHaveBeenCalled();
    });
  });
  describe('supervisorAccompanimentChanged', () => {
    it('should emit', () => {
      spyOn(component.supervisorAccompanimentChange, 'emit');
      component.supervisorAccompanimentChanged();
      expect(component.supervisorAccompanimentChange.emit)
        .toHaveBeenCalled();
    });
  });
  describe('otherAccompanimentChanged', () => {
    it('should emit', () => {
      spyOn(component.otherAccompanimentChange, 'emit');
      component.otherAccompanimentChanged();
      expect(component.otherAccompanimentChange.emit)
        .toHaveBeenCalled();
    });
  });
  describe('interpreterAccompanimentChanged', () => {
    it('should emit', () => {
      spyOn(component.interpreterAccompanimentChange, 'emit');
      component.interpreterAccompanimentChanged();
      expect(component.interpreterAccompanimentChange.emit)
        .toHaveBeenCalled();
    });
  });

});
