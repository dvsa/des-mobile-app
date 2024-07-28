import { EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateLoader, TranslateModule, TranslateParser, TranslateService } from '@ngx-translate/core';
import { InsuranceDeclarationComponent } from '../insurance-declaration';

describe('InsuranceDeclarationComponent', () => {
	let fixture: ComponentFixture<InsuranceDeclarationComponent>;
	let component: InsuranceDeclarationComponent;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [InsuranceDeclarationComponent],
			imports: [IonicModule, TranslateModule.forRoot(), ReactiveFormsModule],
			providers: [TranslateService, TranslateLoader, TranslateParser],
		});

		fixture = TestBed.createComponent(InsuranceDeclarationComponent);
		component = fixture.componentInstance;
	}));

	describe('Class', () => {
		describe('ngOnChanges', () => {
			it('should correctly setup the form control', () => {
				// ARRANGE
				component.formGroup = new UntypedFormGroup({});
				component.selected = true;
				// ACT
				component.ngOnChanges();
				// ASSERT
				const field = component.formGroup.get(InsuranceDeclarationComponent.fieldName);
				expect(field).not.toBeNull();
				expect(field.validator).not.toBeNull();
				expect(field.value).toEqual(true);
			});
		});
		describe('insuranceDeclarationChanged', () => {
			it('should emit a insuranceDeclarationChange event', () => {
				// ARRANGE
				component.formGroup = new UntypedFormGroup({});
				component.ngOnChanges();
				component.insuranceDeclarationChange = new EventEmitter();
				spyOn(component.insuranceDeclarationChange, 'emit');

				// ACT
				component.insuranceDeclarationChanged();
				fixture.detectChanges();

				// ASSERT
				expect(component.insuranceDeclarationChange.emit).toHaveBeenCalled();
			});
		});
		describe('isInvalid', () => {
			it('should validate the field when it is valid', () => {
				// ARRANGE
				component.formGroup = new UntypedFormGroup({});
				component.selected = true;
				component.ngOnChanges();
				fixture.detectChanges();
				// ACT
				const result: boolean = component.isInvalid();

				// ASSERT
				expect(result).toEqual(false);
			});
			it('should not validate the field when it is dirty', () => {
				// ARRANGE
				component.formGroup = new UntypedFormGroup({});
				component.ngOnChanges();
				component.formControl.markAsDirty();
				fixture.detectChanges();

				// ACT
				const result: boolean = component.isInvalid();

				// ASSERT
				expect(result).toEqual(true);
			});
		});
	});
});
