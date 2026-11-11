import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormGroup } from '@angular/forms';
import { MockAppComponent } from '@app/__mocks__/app.component.mock';
import { AppComponent } from '@app/app.component';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CBTNumberComponent } from '../cbt-number';

describe('CBTNumberComponent', () => {
  let fixture: ComponentFixture<CBTNumberComponent>;
  let component: CBTNumberComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CBTNumberComponent],
      providers: [{ provide: AppComponent, useClass: MockAppComponent }],
    });

    fixture = TestBed.createComponent(CBTNumberComponent);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({});
  });

  describe('Class', () => {
    describe('cbtNumberChanged', () => {
      it('It should emit a cbt number if the characters only contain numbers', () => {
        vi.spyOn(component.cbtNumberChange, 'emit').mockReturnValue(undefined);
        const cbtNumber = '1234567';
        component.cbtNumberChanged(cbtNumber);
        expect(component.cbtNumberChange.emit).toHaveBeenCalledWith(cbtNumber);
      });
    });

    describe('invalid', () => {
      it('should be invalid the length is greater then 7', () => {
        component.cbtNumber = '12345678';
        component.ngOnChanges();
        const result: boolean = component.invalid;
        expect(result).toEqual(false);
      });
      it('should be invalid when the length is less then 7', () => {
        component.cbtNumber = '1234';
        component.ngOnChanges();
        const result: boolean = component.invalid;
        expect(result).toEqual(false);
      });
      it('should be invalid when the field when it is empty', () => {
        component.cbtNumber = '';
        component.ngOnChanges();
        const result: boolean = component.invalid;
        expect(result).toEqual(false);
      });
    });
  });
});
