import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostDebriefHoldingCatBPageRoutingModule } from './post-debrief-holding.cat-b-routing.module';

import { PostDebriefHoldingCatBPage } from './post-debrief-holding.cat-b.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostDebriefHoldingCatBPageRoutingModule,
  ],
  declarations: [PostDebriefHoldingCatBPage],
})
export class PostDebriefHoldingCatBPageModule {}
