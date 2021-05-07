import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { EventEmitter } from '@angular/core';
import {
  TranslateModule,
  TranslateService,
  TranslateLoader,
  TranslateParser,
} from '@ngx-translate/core';
import { FormGroup } from '@angular/forms';
import { configureTestSuite } from 'ng-bullet';
import { InsuranceDeclarationComponent } from '../insurance-declaration';

describe('InsuranceDeclarationComponent', () => {
  let fixture: ComponentFixture<InsuranceDeclarationComponent>;
  let component: InsuranceDeclarationComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        InsuranceDeclarationComponent,
      ],
      imports: [
        IonicModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        TranslateService,
        TranslateLoader,
        TranslateParser,
      ],
    });
  });

  beforeEach(async(() => {
    fixture = TestBed.createComponent(InsuranceDeclarationComponent);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    describe('ngOnChanges', () => {
      it('should correctly setup the form control', () => {
        // ARRANGE
        component.formGroup = new FormGroup({});
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
        component.formGroup = new FormGroup({});
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
        component.formGroup = new FormGroup({});
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
        component.formGroup = new FormGroup({});
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
