import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { ModalResultItemComponent } from '../modal-result-item';

describe('ModalResultItemComponent', () => {
  let fixture: ComponentFixture<ModalResultItemComponent>;
  let component: ModalResultItemComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalResultItemComponent],
    });

    fixture = TestBed.createComponent(ModalResultItemComponent);
    component = fixture.componentInstance;
  });

  describe('getOutcomeIcon', () => {
    it('should return pass image when isPass is true', () => {
      component.isPass = true;
      expect(component.getOutcomeIcon()).toEqual('assets/imgs/greenCorrectAnswer.png');
    });

    it('should return fail image when isPass is false', () => {
      component.isPass = false;
      expect(component.getOutcomeIcon()).toEqual('assets/imgs/redWrongAnswer.png');
    });
  });

  describe('displayScore', () => {
    it('should return a hyphen if score is null', () => {
      expect(component.displayScore(null)).toEqual('0%');
    });

    it('should return a hyphen if score is undefined', () => {
      expect(component.displayScore(undefined)).toEqual('0%');
    });

    it('should return score if score is a number', () => {
      expect(component.displayScore(1)).toEqual('1%');
    });
  });
});
