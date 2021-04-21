import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { PostDebriefHoldingCatAMod2PageRoutingModule } from './post-debrief-holding.cat-a-mod2-routing.module';
import { PostDebriefHoldingCatAMod2Page } from './post-debrief-holding.cat-a-mod2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostDebriefHoldingCatAMod2PageRoutingModule,
  ],
  declarations: [PostDebriefHoldingCatAMod2Page],
})
export class PostDebriefHoldingCatAMod2PageModule {}
