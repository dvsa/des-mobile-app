import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { CombinationComponent } from '../combination';

describe('CombinationComponent', () => {
  let fixture: ComponentFixture<CombinationComponent>;
  let component: CombinationComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CombinationComponent],
    });

    fixture = TestBed.createComponent(CombinationComponent);
    component = fixture.componentInstance;
  });

  describe('Class', () => {
    describe('getCombinationText', () => {
      it('should return the combination code passed in', () => {
        expect(component.getCombinationText('LGV1')).toEqual('LGV1');
      });
      it('should return N/A when null is passed in', () => {
        expect(component.getCombinationText(null)).toEqual('N/A');
      });
    });
  });
});
