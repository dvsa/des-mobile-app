import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AutosaveStatusComponent } from '@components/test-slot/autosave-status/autosave-status';
import { beforeEach, describe, expect, it } from 'vitest';

describe('AutosaveStatusComponent', () => {
  let component: AutosaveStatusComponent;
  let fixture: ComponentFixture<AutosaveStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AutosaveStatusComponent],
    });

    fixture = TestBed.createComponent(AutosaveStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
