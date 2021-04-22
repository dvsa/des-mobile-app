import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostDebriefHoldingCatAMod1PageRoutingModule } from './post-debrief-holding.cat-a-mod1-routing.module';

import { PostDebriefHoldingCatAMod1Page } from './post-debrief-holding.cat-a-mod1.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostDebriefHoldingCatAMod1PageRoutingModule,
  ],
  declarations: [PostDebriefHoldingCatAMod1Page],
})
export class PostDebriefHoldingCatAMod1PageModule {}
