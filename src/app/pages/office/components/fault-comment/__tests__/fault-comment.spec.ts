import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AppModule } from 'src/app/app.module';
import { By } from '@angular/platform-browser';
import {
  DrivingFaultsBadgeComponent,
} from '@components/common/driving-faults-badge/driving-faults-badge';
import { UntypedFormGroup, UntypedFormControl, ReactiveFormsModule } from '@angular/forms';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { CommentSource } from '@shared/models/fault-marking.model';
import { ComponentsModule } from '@components/common/common-components.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { behaviourMap } from '../../../office-behaviour-map';
import { FaultCommentComponent } from '../fault-comment';

describe('FaultCommentComponent', () => {
  let fixture: ComponentFixture<FaultCommentComponent>;
  let component: FaultCommentComponent;
  let behaviourMapProvider: OutcomeBehaviourMapProvider;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        FaultCommentComponent,
      ],
      imports: [
        IonicModule,
        AppModule,
        ComponentsModule,
        PipesModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: OutcomeBehaviourMapProvider, useClass: OutcomeBehaviourMapProvider },
      ],
    });

    fixture = TestBed.createComponent(FaultCommentComponent);
    behaviourMapProvider = TestBed.inject(OutcomeBehaviourMapProvider);
    behaviourMapProvider.setBehaviourMap(behaviourMap);
    component = fixture.componentInstance;
    component.parentForm = new UntypedFormGroup({});
    const control = new UntypedFormControl(null);
    component.parentForm.addControl(`faultComment-${CommentSource.SIMPLE}-driving-id`, control);
  }));

  describe('DOM', () => {
    it('should display the fault competency display name', () => {
      component.faultComment = {
        comment: 'comment',
        competencyDisplayName: 'display',
        competencyIdentifier: 'id',
        source: CommentSource.SIMPLE,
        faultCount: 1,
      };
      component.faultType = 'driving';
      component.ngOnChanges();
      fixture.detectChanges();

      const displayName = fixture.debugElement.query(By.css('.fault-label')).nativeElement;

      expect(displayName.innerHTML).toBe('display');
    });

    it('should add validators to the form field if > 15 driving faults.', () => {
      component.faultComment = {
        comment: 'comment',
        competencyDisplayName: 'Signals - timed',
        competencyIdentifier: 'signalsTimed',
        faultCount: 16,
        source: CommentSource.SIMPLE,
      };
      component.faultType = 'driving';
      component.faultCount = 16;
      component.outcome = '5';
      component.shouldRender = true;
      const control = new UntypedFormControl(null);
      component.parentForm.addControl(`faultComment-${CommentSource.SIMPLE}-driving-signalsTimed`, control);

      component.ngOnChanges();
      fixture.detectChanges();

      const { validator } = component.parentForm.get(`faultComment-${CommentSource.SIMPLE}-driving-signalsTimed`);
      expect(validator).not.toBeNull();
    });

    it('should clear validators from the form field if < 16 driving faults.', () => {
      component.faultComment = {
        comment: 'comment',
        competencyDisplayName: 'Signals - timed',
        competencyIdentifier: 'signalsTimed',
        faultCount: 4,
        source: CommentSource.SIMPLE,
      };
      component.faultType = 'driving';
      component.faultCount = 15;
      component.outcome = '5';
      const control = new UntypedFormControl(null);
      component.parentForm.addControl(`faultComment-${CommentSource.SIMPLE}-driving-signalsTimed`, control);

      component.ngOnChanges();
      fixture.detectChanges();

      const { validator } = component.parentForm.get(`faultComment-${CommentSource.SIMPLE}-driving-signalsTimed`);
      expect(validator).toBeNull();
    });

    it('should clear validators for driving faults if > 15 driving faults and shouldRender is false', () => {
      component.faultComment = {
        comment: 'comment',
        competencyDisplayName: 'Signals - timed',
        competencyIdentifier: 'signalsTimed',
        faultCount: 16,
        source: CommentSource.SIMPLE,
      };
      component.faultType = 'driving';
      component.faultCount = 16;
      component.outcome = '5';
      component.shouldRender = false;
      const control = new UntypedFormControl(null);
      component.parentForm.addControl(`faultComment-${CommentSource.SIMPLE}-driving-signalsTimed`, control);

      component.ngOnChanges();
      fixture.detectChanges();
      expect(component.parentForm
        .get(`faultComment-${CommentSource.SIMPLE}-driving-signalsTimed`).validator).toBeNull();
    });

    it('should pass the fault count down to the driving-fault-badge', () => {
      component.faultComment = {
        comment: 'comment',
        competencyDisplayName: 'display',
        competencyIdentifier: 'id',
        faultCount: 3,
        source: CommentSource.SIMPLE,
      };
      component.faultType = 'driving';
      component.ngOnChanges();
      fixture.detectChanges();

      const drivingFaultBadge: DrivingFaultsBadgeComponent = fixture.debugElement
        .query(By.css('driving-faults-badge')).componentInstance;
      expect(drivingFaultBadge.count).toBe(3);
    });

    it('should emit fault comment', () => {
      spyOn(component.faultCommentChange, 'emit');
      const faultComment = 'this is a fault comment';
      component.faultComment = {
        comment: faultComment,
        competencyDisplayName: 'display',
        competencyIdentifier: 'id',
        source: CommentSource.SIMPLE,
        faultCount: 1,
      };
      component.faultType = 'driving';
      component.faultCommentChanged(faultComment);
      expect(component.faultCommentChange.emit).toHaveBeenCalled();
    });

  });

});
