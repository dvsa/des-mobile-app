import { AfterContentInit, Component, ContentChildren, EventEmitter, Output, QueryList } from '@angular/core';

import { transformStringForID } from '@shared/helpers/transform-string-for-id';
import { TabComponent } from '../tab/tab';

@Component({
    selector: 'tabs',
    templateUrl: 'tabs.html',
    styleUrls: ['tabs.scss'],
    standalone: false
})
export class TabsComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

  @Output()
  tabChanged = new EventEmitter<TabComponent>();

  protected readonly transformStringForID = transformStringForID;

  ngAfterContentInit(): void {
    const activeTabs = this.tabs.filter((tab) => tab.active);

    if (activeTabs.length === 0) {
      this.selectTab(this.tabs.first);
    }
  }

  selectTab(selectedTab: TabComponent, emitEvent = false): void {
    this.tabs.toArray().forEach((tab) => {
      tab.active = false;
    });

    selectedTab.active = true;

    if (emitEvent) {
      this.tabChanged.emit(selectedTab);
    }
  }
}
