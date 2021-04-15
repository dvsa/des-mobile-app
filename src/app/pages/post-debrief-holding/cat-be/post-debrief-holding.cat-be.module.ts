import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostDebriefHoldingCatBePageRoutingModule } from './post-debrief-holding.cat-be-routing.module';

import { PostDebriefHoldingCatBePage } from './post-debrief-holding.cat-be.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostDebriefHoldingCatBePageRoutingModule,
  ],
  declarations: [PostDebriefHoldingCatBePage],
})
export class PostDebriefHoldingCatBePageModule {}
