import { AfterContentInit, Component, ContentChildren, EventEmitter, Input, Output, QueryList } from '@angular/core';

import { transformStringForID } from '@shared/helpers/transform-string-for-id';
import { TabComponent } from '../tab/tab';

@Component({
  selector: 'tabs',
  templateUrl: 'tabs.html',
  styleUrls: ['tabs.scss'],
  standalone: false,
})
export class TabsComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

  @Output()
  tabChanged = new EventEmitter<string>();

  @Input() activeTab: string;

  protected readonly transformStringForID = transformStringForID;

  ngAfterContentInit(): void {
    const activeTab = this.tabs.filter((tab) => tab.title === this.activeTab);

    console.log('activeTab', activeTab, this.activeTab);

    if (!activeTab) {
      this.selectTab(this.tabs.first);
    }
    console.log('activeTab', activeTab, this.activeTab);
  }

  selectTab(selectedTab: TabComponent): void {
    this.activeTab = selectedTab.title;
    this.tabChanged.emit(selectedTab.title);
  }
}
