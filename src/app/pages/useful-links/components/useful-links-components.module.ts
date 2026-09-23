import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';

import { EffectsModule } from '@ngrx/effects';
import { LinkModalAnalyticsEffects } from '@pages/useful-links/components/link-modal/link-modal.analytics.effects';
import { LinkModalComponent } from '@pages/useful-links/components/link-modal/link-modal.component';

import { IonicComponentsModule } from '@shared/modules/ionic-components.module';
@NgModule({
  declarations: [LinkModalComponent],
  exports: [LinkModalComponent],
  imports: [IonicComponentsModule, EffectsModule.forFeature([LinkModalAnalyticsEffects]), ComponentsModule],
})
export class UsefulLinksComponentsModule {}
