import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostDebriefHoldingCatHomeTestPageRoutingModule } from './post-debrief-holding.cat-home-test-routing.module';

import { PostDebriefHoldingCatHomeTestPage } from './post-debrief-holding.cat-home-test.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostDebriefHoldingCatHomeTestPageRoutingModule,
  ],
  declarations: [PostDebriefHoldingCatHomeTestPage],
})
export class PostDebriefHoldingCatHomeTestPageModule {}
