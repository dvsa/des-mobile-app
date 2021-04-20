import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostDebriefHoldingCatBEPageRoutingModule } from './post-debrief-holding.cat-be-routing.module';

import { PostDebriefHoldingCatBEPage } from './post-debrief-holding.cat-be.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostDebriefHoldingCatBEPageRoutingModule,
  ],
  declarations: [PostDebriefHoldingCatBEPage],
})
export class PostDebriefHoldingCatBEPageModule {}
