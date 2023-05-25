import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { IonicModule } from '@ionic/angular';
import { By } from '@angular/platform-browser';
import { AppModule } from 'src/app/app.module';
import { UntypedFormGroup, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '@shared/pipes/pipes.module';
import { FaultSummary } from '@shared/models/fault-marking.model';
import { HeaderComponent } from '@components/common/header-component/header.component';
import { FaultCommentComponent } from '../../fault-comment/fault-comment';
import { FaultCommentCardComponent } from '../fault-comment-card';

describe('FaultCommentCardComponent', () => {
  let fixture: ComponentFixture<FaultCommentCardComponent>;
  let component: FaultCommentCardComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        FaultCommentCardComponent,
        MockComponent(FaultCommentComponent),
        MockComponent(HeaderComponent),
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

      const header = fixture.debugElement.query(By.css('header-component')).nativeElement;
      expect(header.innerHTML).toBe(' header ');
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
  describe('faultCommentChanged', () => {
    it('should emit faultCommentsChange with faultComment', () => {
      spyOn(component.faultCommentsChange, 'emit');
      component.faultCommentChanged({ competencyIdentifier: 'test' } as FaultSummary);
      expect(component.faultCommentsChange.emit).toHaveBeenCalledWith({ competencyIdentifier: 'test' } as FaultSummary);
    });
  });

  describe('ngOnChanges', () => {
    it('should emit faultCommentsChange with faultComment', () => {
      component.faultType = 'faultTest';
      component.formGroup = new UntypedFormGroup({});
      component.faultComments = [{
        competencyIdentifier: 'test1',
        competencyDisplayName: 'test2',
        source: 'test3',
        faultCount: 1,
        comment: 'test4',
      }];
      component.ngOnChanges();
      expect(component.formGroup.get('faultComment-test3-faultTest-test1')).toBeDefined();
    });
  });

});
