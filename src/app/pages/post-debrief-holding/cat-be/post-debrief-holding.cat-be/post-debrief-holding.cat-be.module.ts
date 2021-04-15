import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostDebriefHolding.CatBePageRoutingModule } from './post-debrief-holding.cat-be-routing.module';

import { PostDebriefHolding.CatBePage } from './post-debrief-holding.cat-be.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostDebriefHolding.CatBePageRoutingModule
  ],
  declarations: [PostDebriefHolding.CatBePage]
})
export class PostDebriefHolding.CatBePageModule {}
