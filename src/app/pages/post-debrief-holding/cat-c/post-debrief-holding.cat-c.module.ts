import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { PostDebriefHoldingCatCPageRoutingModule } from './post-debrief-holding.cat-c-routing.module';
import { PostDebriefHoldingCatCPage } from './post-debrief-holding.cat-c.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostDebriefHoldingCatCPageRoutingModule,
  ],
  declarations: [PostDebriefHoldingCatCPage],
})
export class PostDebriefHoldingCatCPageModule {}
