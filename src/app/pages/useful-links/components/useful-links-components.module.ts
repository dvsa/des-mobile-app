import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';

import { IonButton, IonCard, IonCol, IonRow } from '@ionic/angular';
import { EffectsModule } from '@ngrx/effects';
import { LinkModalAnalyticsEffects } from '@pages/useful-links/components/link-modal/link-modal.analytics.effects';
import { LinkModalComponent } from '@pages/useful-links/components/link-modal/link-modal.component';

@NgModule({
  declarations: [LinkModalComponent],
  exports: [LinkModalComponent],
  imports: [
    EffectsModule.forFeature([LinkModalAnalyticsEffects]),
    ComponentsModule,
    IonCol,
    IonRow,
    IonButton,
    IonCard,
  ],
})
export class UsefulLinksComponentsModule {}
