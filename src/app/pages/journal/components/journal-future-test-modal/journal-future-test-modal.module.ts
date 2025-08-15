import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '@components/common/common-components.module';
import { EffectsModule } from '@ngrx/effects';
import { JournalFutureTestModal } from '@pages/journal/components/journal-future-test-modal/journal-future-test-modal';
import { JournalFutureTestModalAnalyticsEffects } from '@pages/journal/components/journal-future-test-modal/journal-future-test-modal.analytics.effects';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    EffectsModule.forFeature([JournalFutureTestModalAnalyticsEffects]),
  ],
  declarations: [JournalFutureTestModal],
})
export class JournalFutureTestModalModule {}
