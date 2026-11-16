import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { TranslateService } from '@ngx-translate/core';
import { translateServiceMock } from '@shared/helpers/__mocks__/translate.mock';
import { LockScreenIndicator } from '../lock-screen-indicator';

describe('LockScreenIndicator', () => {
  let fixture: ComponentFixture<LockScreenIndicator>;
  let component: LockScreenIndicator;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LockScreenIndicator],
      providers: [{ provide: TranslateService, useValue: translateServiceMock }],
    });

    fixture = TestBed.createComponent(LockScreenIndicator);
    component = fixture.componentInstance;
  });

  describe('Class', () => {
    it('should create', () => {
      expect(component).toBeDefined();
    });
  });
});
