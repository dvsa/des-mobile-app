import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { ECOCardComponent } from '../eco-card.component';

describe('ECOCardComponent', () => {
  let component: ECOCardComponent;
  let fixture: ComponentFixture<ECOCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ECOCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ECOCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
