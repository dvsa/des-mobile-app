
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
import { ResidencyDeclarationComponent } from '../residency-declaration';
import { configureTestSuite } from 'ng-bullet';

describe('ResidencyDeclarationComponent', () => {
  let fixture: ComponentFixture<ResidencyDeclarationComponent>;
  let component: ResidencyDeclarationComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        ResidencyDeclarationComponent,
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
    fixture = TestBed.createComponent(ResidencyDeclarationComponent);
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
        const field = component.formGroup.get(ResidencyDeclarationComponent.fieldName);
        expect(field).not.toBeNull();
        expect(field.validator).not.toBeNull();
        expect(field.value).toEqual(true);
      });
    });
    describe('residencyDeclarationChanged', () => {
      it('should emit a residencyDeclarationChange event', () => {
        // ARRANGE
        component.formGroup = new FormGroup({});
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
