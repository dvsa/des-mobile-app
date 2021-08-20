
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { IonicModule } from 'ionic-angular';
import { EventEmitter } from '@angular/core';
import { HealthDeclarationComponent } from '../health-declaration';
import {
  TranslateModule,
  TranslateService,
  TranslateLoader,
  TranslateParser,
} from '@ngx-translate/core';
import { FormGroup } from '@angular/forms';
import { configureTestSuite } from 'ng-bullet';

describe('HealthDeclarationComponent', () => {
  let fixture: ComponentFixture<HealthDeclarationComponent>;
  let component: HealthDeclarationComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        HealthDeclarationComponent,
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
    fixture = TestBed.createComponent(HealthDeclarationComponent);
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
        const field = component.formGroup.get(HealthDeclarationComponent.fieldName);
        expect(field.value).toEqual('true');
      });
    });
    describe('healthDeclarationChanged', () => {
      it('should emit a healthDeclarationChange event', () => {
        // ARRANGE
        component.formGroup = new FormGroup({});
        component.ngOnChanges();
        component.healthDeclarationChange = new EventEmitter();
        spyOn(component.healthDeclarationChange, 'emit');

        // ACT
        component.healthDeclarationChanged();
        fixture.detectChanges();

        // ASSERT
        expect(component.healthDeclarationChange.emit).toHaveBeenCalled();
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
    });
  });
});
