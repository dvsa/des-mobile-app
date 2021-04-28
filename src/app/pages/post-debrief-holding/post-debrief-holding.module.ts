import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostDebriefHoldingPageRoutingModule } from './post-debrief-holding-routing.module';

import { PostDebriefHoldingPage } from './post-debrief-holding.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostDebriefHoldingPageRoutingModule,
  ],
  declarations: [PostDebriefHoldingPage],
})
export class PostDebriefHoldingPageModule {}
