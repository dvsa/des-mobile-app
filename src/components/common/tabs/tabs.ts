import {
  Component,
  ContentChildren,
  QueryList,
  AfterContentInit, Output, EventEmitter,
} from '@angular/core';

import { TabComponent } from '../tab/tab';

@Component({
  selector: 'tabs',
  templateUrl: 'tabs.html',
  styleUrls: ['tabs.scss'],
})
export class TabsComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

  @Output()
  tabChanged = new EventEmitter<TabComponent>();

  ngAfterContentInit(): void {
    const activeTabs = this.tabs.filter((tab) => tab.active);

    if (activeTabs.length === 0) {
      this.selectTab(this.tabs.first);
    }
  }

  selectTab(selectedTab: TabComponent, emitEvent: boolean = false): void {
    this.tabs.toArray().forEach((tab) => { tab.active = false; });

    selectedTab.active = true;

    if (emitEvent) {
      this.tabChanged.emit(selectedTab);
    }
  }
}
