import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ExaminerRecordsLabelTextComponent } from '@pages/examiner-records/components/examiner-records-label-text/examiner-records-label-text';

describe('ExaminerRecordsLearnMoreModalComponent', () => {
  let component: ExaminerRecordsLabelTextComponent;
  let fixture: ComponentFixture<ExaminerRecordsLabelTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExaminerRecordsLabelTextComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExaminerRecordsLabelTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('onShowLearnMoreModal', () => {
    it('should emit showLearnMoreModal event', () => {
      vi.spyOn(component.showLearnMoreModal, 'emit').mockReturnValue(undefined);
      component.onShowLearnMoreModal();
      expect(component.showLearnMoreModal.emit).toHaveBeenCalled();
    });
  });
});
