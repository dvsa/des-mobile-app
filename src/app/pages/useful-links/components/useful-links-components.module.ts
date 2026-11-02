import { NgModule } from '@angular/core';

import { IonButton, IonCard, IonCol, IonRow } from '@ionic/angular';
import { EffectsModule } from '@ngrx/effects';
import { LinkModalAnalyticsEffects } from '@pages/useful-links/components/link-modal/link-modal.analytics.effects';
import { LinkModalComponent } from '@pages/useful-links/components/link-modal/link-modal.component';

@NgModule({
  exports: [LinkModalComponent],
  imports: [
    EffectsModule.forFeature([LinkModalAnalyticsEffects]),
    IonCol,
    IonRow,
    IonButton,
    IonCard,
    LinkModalComponent,
  ],
})
export class UsefulLinksComponentsModule {}
