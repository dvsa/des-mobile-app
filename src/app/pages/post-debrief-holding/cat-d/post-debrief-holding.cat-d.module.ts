import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { PostDebriefHoldingCatDPageRoutingModule } from './post-debrief-holding.cat-d-routing.module';
import { PostDebriefHoldingCatDPage } from './post-debrief-holding.cat-d.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostDebriefHoldingCatDPageRoutingModule,
  ],
  declarations: [PostDebriefHoldingCatDPage],
})
export class PostDebriefHoldingCatDPageModule {}
