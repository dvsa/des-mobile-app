import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { IpadIssueComponent } from '../ipad-issue';

describe('IpadIssueComponent', () => {
  let fixture: ComponentFixture<IpadIssueComponent>;
  let component: IpadIssueComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, IpadIssueComponent],
    });

    fixture = TestBed.createComponent(IpadIssueComponent);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({});
    component.ngOnChanges();
  });

  describe('class', () => {
    describe('ngOnChanges', () => {
      it('should add the form controls', () => {
        expect(component.formGroup.get('ipadIssueSelected')).not.toBeNull();
        expect(component.formGroup.get('ipadIssueTechnicalFault')).not.toBeNull();
        expect(component.formGroup.get('ipadIssueLost')).not.toBeNull();
        expect(component.formGroup.get('ipadIssueStolen')).not.toBeNull();
        expect(component.formGroup.get('ipadIssueBroken')).not.toBeNull();
      });
    });

    describe('selectedValueChanged', () => {
      it('should emit when checkbox is selected', () => {
        vi.spyOn(component.selectedChange, 'emit').mockReturnValue(undefined);
        component.selectedValueChanged(true);
        expect(component.selectedChange.emit).toHaveBeenCalledWith(true);
      });
      it('should reset the fields when unselecting the checkbox', () => {
        const technicalFault = component.formGroup.get('ipadIssueTechnicalFault');
        vi.spyOn(technicalFault, 'reset').mockReturnValue(undefined);
        const lost = component.formGroup.get('ipadIssueLost');
        vi.spyOn(lost, 'reset').mockReturnValue(undefined);
        const stolen = component.formGroup.get('ipadIssueStolen');
        vi.spyOn(stolen, 'reset').mockReturnValue(undefined);
        const broken = component.formGroup.get('ipadIssueBroken');
        vi.spyOn(broken, 'reset').mockReturnValue(undefined);
        component.selectedValueChanged(false);
        expect(technicalFault.reset).toHaveBeenCalled();
        expect(lost.reset).toHaveBeenCalled();
        expect(stolen.reset).toHaveBeenCalled();
        expect(broken.reset).toHaveBeenCalled();
      });
    });

    describe('technicalFaultSelected', () => {
      it('should emit', () => {
        vi.spyOn(component.technicalFaultChange, 'emit').mockReturnValue(undefined);
        component.technicalFaultSelected();
        expect(component.technicalFaultChange.emit).toHaveBeenCalledWith(true);
      });
    });

    describe('lostSelected', () => {
      it('should emit', () => {
        vi.spyOn(component.lostChange, 'emit').mockReturnValue(undefined);
        component.lostSelected();
        expect(component.lostChange.emit).toHaveBeenCalledWith(true);
      });
    });

    describe('stolenSelected', () => {
      it('should emit', () => {
        vi.spyOn(component.stolenChange, 'emit').mockReturnValue(undefined);
        component.stolenSelected();
        expect(component.stolenChange.emit).toHaveBeenCalledWith(true);
      });
    });

    describe('brokenSelected', () => {
      it('should emit', () => {
        vi.spyOn(component.brokenChange, 'emit').mockReturnValue(undefined);
        component.brokenSelected();
        expect(component.brokenChange.emit).toHaveBeenCalledWith(true);
      });
    });
  });

  describe('DOM', () => {
    describe('select checkbox', () => {
      it('should show the radio buttons when selected', () => {
        component.selected = true;
        fixture.detectChanges();
        const radios = fixture.debugElement.query(By.css('#ipadIssueSection'));
        expect(radios).toBeDefined();
      });

      it('should not show the radio buttons when not selected', () => {
        component.selected = false;
        fixture.detectChanges();
        const radios = fixture.debugElement.query(By.css('#ipadIssueSection'));
        expect(radios).toBeNull();
      });
    });
  });
});
