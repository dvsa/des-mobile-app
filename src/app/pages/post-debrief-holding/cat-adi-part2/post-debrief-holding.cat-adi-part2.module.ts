import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostDebriefHoldingCatADIPart2PageRoutingModule } from './post-debrief-holding.cat-adi-part2-routing.module';

import { PostDebriefHoldingCatAdiPart2Page } from './post-debrief-holding.cat-adi-part2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostDebriefHoldingCatADIPart2PageRoutingModule,
  ],
  declarations: [PostDebriefHoldingCatAdiPart2Page],
})
export class PostDebriefHoldingCatADIPart2PageModule {}
