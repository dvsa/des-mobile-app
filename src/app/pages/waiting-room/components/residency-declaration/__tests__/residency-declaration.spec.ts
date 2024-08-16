import { EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateLoader, TranslateModule, TranslateParser, TranslateService } from '@ngx-translate/core';
import { ResidencyDeclarationComponent } from '../residency-declaration';

describe('ResidencyDeclarationComponent', () => {
  let fixture: ComponentFixture<ResidencyDeclarationComponent>;
  let component: ResidencyDeclarationComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ResidencyDeclarationComponent],
      imports: [IonicModule, TranslateModule.forRoot(), ReactiveFormsModule],
      providers: [TranslateService, TranslateLoader, TranslateParser],
    });

    fixture = TestBed.createComponent(ResidencyDeclarationComponent);
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
        const field = component.formGroup.get(ResidencyDeclarationComponent.fieldName);
        expect(field).not.toBeNull();
        expect(field.validator).not.toBeNull();
        expect(field.value).toEqual(true);
      });
    });
    describe('residencyDeclarationChanged', () => {
      it('should emit a residencyDeclarationChange event', () => {
        // ARRANGE
        component.formGroup = new UntypedFormGroup({});
        component.ngOnChanges();
        component.residencyDeclarationChange = new EventEmitter();
        spyOn(component.residencyDeclarationChange, 'emit');

        // ACT
        component.residencyDeclarationChanged();
        fixture.detectChanges();

        // ASSERT
        expect(component.residencyDeclarationChange.emit).toHaveBeenCalled();
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
