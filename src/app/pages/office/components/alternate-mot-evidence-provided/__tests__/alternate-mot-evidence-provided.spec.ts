import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ComponentsModule } from '@components/common/common-components.module';
import { IonicModule } from '@ionic/angular';
import {
  AlternateEvidenceProvidedComponent
} from '@pages/office/components/alternate-mot-evidence-provided/alternate-evidence-provided.component';

describe('AlternateEvidenceProvidedComponent', () => {
  let modalFixture: ComponentFixture<AlternateEvidenceProvidedComponent>;
  let modalComponent: AlternateEvidenceProvidedComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AlternateEvidenceProvidedComponent],
      imports: [CommonModule, IonicModule, ComponentsModule],
    });

  }));

  describe('Class', () => {
    it('should create', async () => {
      modalFixture = TestBed.createComponent(AlternateEvidenceProvidedComponent);
      modalComponent = modalFixture.componentInstance;
      expect(modalComponent).toBeDefined();
    });
  });

});
