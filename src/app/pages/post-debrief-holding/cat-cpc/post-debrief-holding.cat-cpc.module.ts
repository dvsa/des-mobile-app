import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostDebriefHoldingCatCPCPageRoutingModule } from './post-debrief-holding.cat-cpc-routing.module';

import { PostDebriefHoldingCatCPCPage } from './post-debrief-holding.cat-cpc.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostDebriefHoldingCatCPCPageRoutingModule,
  ],
  declarations: [PostDebriefHoldingCatCPCPage],
})
export class PostDebriefHoldingCatCPCPageModule {}
