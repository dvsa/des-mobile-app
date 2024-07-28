import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AssessmentReportComponent } from '@pages/office/cat-cpc/components/assessment-report/assessment-report';

describe('AssessmentReportComponent', () => {
	let fixture: ComponentFixture<AssessmentReportComponent>;
	let component: AssessmentReportComponent;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [AssessmentReportComponent],
			imports: [IonicModule],
		});

		fixture = TestBed.createComponent(AssessmentReportComponent);
		component = fixture.componentInstance;
	}));

	describe('invalid', () => {
		it('should return true if the formControl is invalid and dirty', () => {
			component.formControl = null;
			component.formGroup = new UntypedFormGroup({});
			component.ngOnChanges();
			component.formControl.setValidators([Validators.required]);

			component.formControl.setValue(null);
			component.formControl.markAsDirty();

			expect(component.invalid).toBeTruthy();
		});
		it('should return false if the formControl is valid and dirty', () => {
			component.formControl = null;
			component.formGroup = new UntypedFormGroup({});
			component.ngOnChanges();
			component.formControl.setValidators([Validators.required]);

			component.formControl.setValue(1);
			component.formControl.markAsDirty();

			expect(component.invalid).toBeFalsy();
		});
		it('should return false if the formControl is invalid and clean', () => {
			component.formControl = null;
			component.formGroup = new UntypedFormGroup({});
			component.ngOnChanges();
			component.formControl.setValidators([Validators.required]);

			component.formControl.setValue(null);
			component.formControl.markAsPristine();

			expect(component.invalid).toBeFalsy();
		});
		it('should return false if the formControl is valid and clean', () => {
			component.formControl = null;
			component.formGroup = new UntypedFormGroup({});
			component.ngOnChanges();
			component.formControl.setValidators([Validators.required]);

			component.formControl.setValue(1);
			component.formControl.markAsPristine();

			expect(component.invalid).toBeFalsy();
		});
	});

	describe('assessmentReportChanged', () => {
		it('should emit assessmentReportChange with correct parameters', () => {
			spyOn(component.assessmentReportChange, 'emit');
			component.assessmentReportChanged('test');
			expect(component.assessmentReportChange.emit).toHaveBeenCalledWith('test');
		});
	});
});
