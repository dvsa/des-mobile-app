import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { OfficeRegistrationAndMotComponent } from '../office-registration-and-mot.component';

describe('OfficeRegistrationAndMotComponent', () => {
  let component: OfficeRegistrationAndMotComponent;
  let fixture: ComponentFixture<OfficeRegistrationAndMotComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OfficeRegistrationAndMotComponent],
    });

    fixture = TestBed.createComponent(OfficeRegistrationAndMotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
