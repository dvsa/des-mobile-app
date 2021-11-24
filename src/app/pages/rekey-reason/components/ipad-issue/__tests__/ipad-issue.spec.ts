import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AppModule } from '@app/app.module';
import { By } from '@angular/platform-browser';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { configureTestSuite } from 'ng-bullet';
import { IpadIssueComponent } from '../ipad-issue';

describe('IpadIssueComponent', () => {
  let fixture: ComponentFixture<IpadIssueComponent>;
  let component: IpadIssueComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        IpadIssueComponent,
      ],
      imports: [
        IonicModule,
        AppModule,
        ReactiveFormsModule,
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(IpadIssueComponent);
    component = fixture.componentInstance;
    component.formGroup = new FormGroup({});
    component.ngOnChanges();
  }));

  describe('class', () => {

    describe('ngOnChanges', () => {
      it('should add the form controls', () => {
        expect(component.formGroup.get('ipadIssueSelected')).not.toBeNull();
        expect(component.formGroup.get('ipadIssueTechnicalFault')).not.toBeNull();
        expect(component.formGroup.get('ipadIssueLost')).not.toBeNull();
        expect(component.formGroup.get('ipadIssueStolen')).not.toBeNull();
        expect(component.formGroup.get('ipadIssueBroken')).not.toBeNull();
      });
    });

    describe('selectedValueChanged', () => {
      it('should emit when checkbox is selected', () => {
        spyOn(component.selectedChange, 'emit');
        component.selectedValueChanged(true);
        expect(component.selectedChange.emit).toHaveBeenCalledWith(true);
      });
      it('should reset the fields when unselecting the checkbox', () => {
        const technicalFault = component.formGroup.get('ipadIssueTechnicalFault');
        spyOn(technicalFault, 'reset');
        const lost = component.formGroup.get('ipadIssueLost');
        spyOn(lost, 'reset');
        const stolen = component.formGroup.get('ipadIssueStolen');
        spyOn(stolen, 'reset');
        const broken = component.formGroup.get('ipadIssueBroken');
        spyOn(broken, 'reset');
        component.selectedValueChanged(false);
        expect(technicalFault.reset).toHaveBeenCalled();
        expect(lost.reset).toHaveBeenCalled();
        expect(stolen.reset).toHaveBeenCalled();
        expect(broken.reset).toHaveBeenCalled();
      });
    });

    describe('technicalFaultSelected', () => {
      it('should emit', () => {
        spyOn(component.technicalFaultChange, 'emit');
        component.technicalFaultSelected();
        expect(component.technicalFaultChange.emit).toHaveBeenCalledWith(true);
      });
    });

    describe('lostSelected', () => {
      it('should emit', () => {
        spyOn(component.lostChange, 'emit');
        component.lostSelected();
        expect(component.lostChange.emit).toHaveBeenCalledWith(true);
      });
    });

    describe('stolenSelected', () => {
      it('should emit', () => {
        spyOn(component.stolenChange, 'emit');
        component.stolenSelected();
        expect(component.stolenChange.emit).toHaveBeenCalledWith(true);
      });
    });

    describe('brokenSelected', () => {
      it('should emit', () => {
        spyOn(component.brokenChange, 'emit');
        component.brokenSelected();
        expect(component.brokenChange.emit).toHaveBeenCalledWith(true);
      });
    });

  });

  describe('DOM', () => {
    describe('select checkbox', () => {
      it('should show the radio buttons when selected', () => {
        component.selected = true;
        fixture.detectChanges();
        const radios = fixture.debugElement.query(By.css('#ipadIssueSection'));
        expect(radios).toBeDefined();
      });

      it('should not show the radio buttons when not selected', () => {
        component.selected = false;
        fixture.detectChanges();
        const radios = fixture.debugElement.query(By.css('#ipadIssueSection'));
        expect(radios).toBeNull();
      });
    });
  });
});
