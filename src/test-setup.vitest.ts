import 'fake-indexeddb/auto';
import { Buffer } from 'buffer';
import { ComponentFixture } from '@angular/core/testing';
import { iconList } from '@shared/constants/ion-icon-list';
import { addIcons } from 'ionicons';

Object.assign(window, { Buffer, global: window });
addIcons(iconList);

const detectChanges = ComponentFixture.prototype.detectChanges;
ComponentFixture.prototype.detectChanges = function (checkNoChanges = false) {
  return detectChanges.call(this, checkNoChanges);
};
