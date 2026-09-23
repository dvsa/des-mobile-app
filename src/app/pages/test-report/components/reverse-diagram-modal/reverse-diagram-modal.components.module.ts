import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';

import { ReverseDiagramLinkComponent } from '../reverse-diagram-link/reverse-diagram-link';
import { ReverseLeftPopoverComponent } from '../reverse-left-popover/reverse-left-popover';
import { ReverseLeftComponent } from '../reverse-left/reverse-left';
import { TestReportComponentsModule } from '../test-report-components.module';

import { IonicComponentsModule } from '@shared/modules/ionic-components.module';
@NgModule({
  declarations: [ReverseLeftComponent, ReverseDiagramLinkComponent, ReverseLeftPopoverComponent],
  imports: [IonicComponentsModule, CommonModule, TestReportComponentsModule, ComponentsModule],
  exports: [ReverseLeftComponent, ReverseDiagramLinkComponent, ReverseLeftPopoverComponent],
})
export class ReverseDiagramModalComponentsModule {}
