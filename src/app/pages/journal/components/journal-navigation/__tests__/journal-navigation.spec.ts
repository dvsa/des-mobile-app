import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { JournalNavigationComponent } from '../journal-navigation';

describe('JournalNavigationComponent', () => {
  let fixture: ComponentFixture<JournalNavigationComponent>;
  let component: JournalNavigationComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [JournalNavigationComponent],
    });

    fixture = TestBed.createComponent(JournalNavigationComponent);
    component = fixture.componentInstance;
  });

  describe('onPreviousDayClick', () => {
    it('should emit previousDayClicked', () => {
      vi.spyOn(component.previousDayClicked, 'emit').mockReturnValue(undefined);
      component.onPreviousDayClick();
      expect(component.previousDayClicked.emit).toHaveBeenCalled();
    });
  });

  describe('onNextDayClick', () => {
    it('should emit nextDayClicked', () => {
      vi.spyOn(component.nextDayClicked, 'emit').mockReturnValue(undefined);
      component.onNextDayClick();
      expect(component.nextDayClicked.emit).toHaveBeenCalled();
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
