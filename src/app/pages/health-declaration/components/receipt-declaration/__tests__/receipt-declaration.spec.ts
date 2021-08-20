
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { IonicModule } from 'ionic-angular';
import { EventEmitter } from '@angular/core';
import { ReceiptDeclarationComponent } from '../receipt-declaration';
import {
  TranslateModule,
} from '@ngx-translate/core';
import { FormGroup } from '@angular/forms';
import { configureTestSuite } from 'ng-bullet';

describe('ReceiptDeclarationComponent', () => {
  let fixture: ComponentFixture<ReceiptDeclarationComponent>;
  let component: ReceiptDeclarationComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        ReceiptDeclarationComponent,
      ],
      imports: [
        IonicModule,
        TranslateModule.forRoot(),
      ],
    });
  });

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ReceiptDeclarationComponent);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    describe('ngOnChanges', () => {
      it('should correctly setup the form control', () => {
        // ARRANGE
        component.formGroup = new FormGroup({});
        component.selected = 'true';
        // ACT
        component.ngOnChanges();
        // ASSERT
        const field = component.formGroup.get(ReceiptDeclarationComponent.fieldName);
        expect(field).not.toBeNull();
        expect(field.validator).not.toBeNull();
        expect(field.value).toEqual('true');
      });
    });
    describe('receiptDeclarationChanged', () => {
      it('should emit a receiptDeclarationChange event', () => {
        // ARRANGE
        component.formGroup = new FormGroup({});
        component.ngOnChanges();
        component.receiptDeclarationChange = new EventEmitter();
        spyOn(component.receiptDeclarationChange, 'emit');

        // ACT
        component.receiptDeclarationChanged();
        fixture.detectChanges();

        // ASSERT
        expect(component.receiptDeclarationChange.emit).toHaveBeenCalled();
      });
    });
    describe('isInvalid', () => {
      it('should validate the field when it is valid', () => {
        // ARRANGE
        component.formGroup = new FormGroup({});
        component.selected = 'true';
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
