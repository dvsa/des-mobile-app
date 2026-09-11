import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';
import { TestFlowHeaderComponent } from '@components/common/test-flow-header/test-flow-header.component';

import { IonButton, IonContent, IonHeader, IonToolbar } from '@ionic/angular';
import { EffectsModule } from '@ngrx/effects';
import { PostDebriefHoldingAnalyticsEffects } from '@pages/post-debrief-holding/post-debrief-holding.analytics.effects';
import { PostDebriefHoldingPageRoutingModule } from './post-debrief-holding-routing.module';
import { PostDebriefHoldingPage } from './post-debrief-holding.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    PostDebriefHoldingPageRoutingModule,
    ComponentsModule,
    EffectsModule.forFeature([PostDebriefHoldingAnalyticsEffects]),
    TestFlowHeaderComponent,
    IonButton,
    IonContent,
    IonToolbar,
    IonHeader,
  ],
  declarations: [PostDebriefHoldingPage],
})
export class PostDebriefHoldingPageModule {}
