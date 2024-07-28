import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CommonModule } from '@angular/common';
import { AppModule } from '@app/app.module';
import { ComponentsModule } from '@components/common/common-components.module';
import { CandidateLinkComponent } from '@components/test-slot/candidate-link/candidate-link';
import { StoreModule } from '@ngrx/store';
import { CandidateDetailsPageModule } from '@pages/candidate-details/candidate-details.module';

describe('CandidateLinkComponent', () => {
  let fixture: ComponentFixture<CandidateLinkComponent>;
  let component: CandidateLinkComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CandidateLinkComponent],
      imports: [
        IonicModule,
        AppModule,
        ComponentsModule,
        CommonModule,
        CandidateDetailsPageModule,
        StoreModule.forRoot({}),
      ],
    });

    fixture = TestBed.createComponent(CandidateLinkComponent);
    component = fixture.componentInstance;
  }));

  describe('openCandidateDetailsModal', () => {
    it('should display modal', async () => {
      spyOn(component.modalController, 'create').and.returnValue(
        Promise.resolve({
          present: async () => {},
          onDidDismiss: () => {},
        } as HTMLIonModalElement)
      );
      await component.openCandidateDetailsModal();
      expect(component.modalController.create).toHaveBeenCalledTimes(1);
    });
  });
});
