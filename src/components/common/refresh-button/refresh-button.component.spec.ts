import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RefreshButtonComponent } from './refresh-button.component';

describe('RefreshButtonComponent', () => {
  let component: RefreshButtonComponent;
  let fixture: ComponentFixture<RefreshButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RefreshButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RefreshButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit refreshButtonClicked event when refreshClicked is called', () => {
    vi.spyOn(component.refreshButtonClicked, 'emit').mockReturnValue(undefined);
    component.refreshClicked();
    expect(component.refreshButtonClicked.emit).toHaveBeenCalled();
  });
});
