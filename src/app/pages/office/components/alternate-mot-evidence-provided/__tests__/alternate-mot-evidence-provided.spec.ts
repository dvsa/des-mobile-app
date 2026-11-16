import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlternateEvidenceProvidedComponent } from '@pages/office/components/alternate-mot-evidence-provided/alternate-evidence-provided.component';
import { beforeEach, describe, expect, it } from 'vitest';

describe('AlternateEvidenceProvidedComponent', () => {
  let modalFixture: ComponentFixture<AlternateEvidenceProvidedComponent>;
  let modalComponent: AlternateEvidenceProvidedComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, AlternateEvidenceProvidedComponent],
    });
  });

  describe('Class', () => {
    it('should create', async () => {
      modalFixture = TestBed.createComponent(AlternateEvidenceProvidedComponent);
      modalComponent = modalFixture.componentInstance;
      expect(modalComponent).toBeDefined();
    });
  });
});
