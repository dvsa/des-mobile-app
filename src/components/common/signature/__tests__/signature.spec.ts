import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { SignatureAreaComponent } from '@components/common/signature-area/signature-area';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { SignatureComponent } from '../signature';

describe('SignatureComponent', () => {
  let fixture: ComponentFixture<SignatureComponent>;
  let component: SignatureComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SignatureComponent, MockComponent(SignatureAreaComponent)],
      imports: [IonicModule, TranslateModule.forRoot(), ReactiveFormsModule],
    });

    fixture = TestBed.createComponent(SignatureComponent);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    describe('ngOnChanges', () => {
      it('should correctly setup the form control', () => {
        // ARRANGE
        component.formGroup = new UntypedFormGroup({});
        component.signature = 'abcdefg';
        // ACT
        component.ngOnChanges();
        // ASSERT
        const field = component.formGroup.get(SignatureComponent.fieldName);
        expect(field).not.toBeNull();
        expect(field.validator).not.toBeNull();
        expect(field.value).toEqual('abcdefg');
      });
    });
    describe('isInvalid', () => {
      it('should validate the field when it is valid', () => {
        // ARRANGE
        component.formGroup = new UntypedFormGroup({});
        component.signature = 'test data';
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
