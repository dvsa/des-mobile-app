import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { IonicModule } from '@ionic/angular';
import { By } from '@angular/platform-browser';
import { AppModule } from 'src/app/app.module';
import { UntypedFormGroup, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '@shared/pipes/pipes.module';
import { FaultCommentComponent } from '../../fault-comment/fault-comment';
import { FaultCommentCardComponent } from '../fault-comment-card';

fdescribe('FaultCommentCardComponent', () => {
  let fixture: ComponentFixture<FaultCommentCardComponent>;
  let component: FaultCommentCardComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        FaultCommentCardComponent,
        MockComponent(FaultCommentComponent),
      ],
      imports: [
        IonicModule,
        AppModule,
        ReactiveFormsModule,
        PipesModule,
      ],
    });

    fixture = TestBed.createComponent(FaultCommentCardComponent);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({});
  }));

  describe('DOM', () => {
    it('should display the provided header', () => {
      component.shouldRender = true;
      component.header = 'header';
      component.faultComments = [];
      component.faultType = 'drivingFault';
      fixture.detectChanges();

      const header = fixture.debugElement.query(By.css('h4')).nativeElement;
      expect(header.innerHTML).toBe('header');
    });

    it('should pass the faultComment and type to the fault-comment component', () => {
      component.shouldRender = true;
      component.faultComments = [
        {
          comment: 'c1', competencyIdentifier: 'id1', competencyDisplayName: 'display1', faultCount: 1,
        },
        {
          comment: 'c2', competencyIdentifier: 'id2', competencyDisplayName: 'display2', faultCount: 1,
        },
      ];
      component.faultType = 'drivingFault';
      fixture.detectChanges();

      const commentLabels = fixture.debugElement.queryAll(By.css('fault-comment'));
      expect(commentLabels.length).toBe(2);
      expect(commentLabels[0].componentInstance.faultType).toBe('drivingFault');
      expect(commentLabels[1].componentInstance.faultType).toBe('drivingFault');
      expect(commentLabels[0].componentInstance.faultComment).toBe(component.faultComments[0]);
      expect(commentLabels[1].componentInstance.faultComment).toBe(component.faultComments[1]);
    });
  });

});
