import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DebriefCatCPage } from './debrief.cat-c.page';

const routes: Routes = [
  {
    path: '',
    component: DebriefCatCPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DebriefCatCPageRoutingModule {}
