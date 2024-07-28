import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { AppModule } from '@app/app.module';
import { IonicModule } from '@ionic/angular';
import { CandidateDeclarationSignedComponent } from '../candidate-declaration';

describe('CandidateDeclarationSignedComponent', () => {
	let fixture: ComponentFixture<CandidateDeclarationSignedComponent>;
	let component: CandidateDeclarationSignedComponent;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [CandidateDeclarationSignedComponent],
			imports: [IonicModule, AppModule, ReactiveFormsModule],
		});

		fixture = TestBed.createComponent(CandidateDeclarationSignedComponent);
		component = fixture.componentInstance;
		component.formGroup = new UntypedFormGroup({});
	}));

	describe('DOM', () => {
		it('should call CandidateDeclarationChanged with Y when signed is pressed', () => {
			spyOn(component, 'candidateDeclarationChanged');
			component.ngOnChanges();
			const declarationSignedRadio = fixture.debugElement.query(By.css('#declaration-signed'));
			declarationSignedRadio.triggerEventHandler('change', { target: { value: 'Y' } });
			fixture.detectChanges();
			expect(component.candidateDeclarationChanged).toHaveBeenCalledWith('Y');
		});
		it('should call CandidateDeclarationChanged with N when not signed is pressed', () => {
			spyOn(component, 'candidateDeclarationChanged');
			component.ngOnChanges();
			const declarationSignedRadio = fixture.debugElement.query(By.css('#declaration-not-signed'));
			declarationSignedRadio.triggerEventHandler('change', { target: { value: 'N' } });
			fixture.detectChanges();
			expect(component.candidateDeclarationChanged).toHaveBeenCalledWith('N');
		});
	});
	describe('ngOnChanges', () => {
		it('should patch formControl with Y if declarationSelected and candidateSigned are both true', () => {
			component.declarationSelected = true;
			component.candidateSigned = true;

			component.ngOnChanges();
			expect(component.formControl.value).toBe('Y');
		});
		it('should patch formControl with N if declarationSelected is false and candidateSigned is true', () => {
			component.declarationSelected = false;
			component.candidateSigned = true;

			component.ngOnChanges();
			expect(component.formControl.value).toBe('N');
		});
	});
	describe('candidateDeclarationChanged', () => {
		it('should emit true if declarationSelected is set to Y and formControl is valid', () => {
			component.formControl = new UntypedFormControl(null, [Validators.required]);
			component.formControl.setValue(true);
			spyOn(component.candidateDeclarationChange, 'emit');

			component.candidateDeclarationChanged('Y');

			expect(component.candidateDeclarationChange.emit).toHaveBeenCalledWith(true);
		});
	});
});
