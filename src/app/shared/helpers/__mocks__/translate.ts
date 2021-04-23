/* eslint-disable */
// A mock for @ngx-translate's TranslateService
import { TranslateStore } from '@ngx-translate/core/lib/translate.store';
import { TranslateLoader } from '@ngx-translate/core/lib/translate.loader';
import { TranslateCompiler } from '@ngx-translate/core/lib/translate.compiler';
import { TranslateParser } from '@ngx-translate/core/lib/translate.parser';
import { MissingTranslationHandler } from '@ngx-translate/core/lib/missing-translation-handler';
import { EventEmitter } from '@angular/core';
import { of } from 'rxjs';
import {
  DefaultLangChangeEvent,
  LangChangeEvent,
  TranslationChangeEvent,
} from '@ngx-translate/core/lib/translate.service';

export const translateServiceMock = jasmine.createSpyObj('TranslateService', ['setDefaultLang']);

export class TranslateServiceClassMock {
  store: TranslateStore;
  currentLoader: TranslateLoader;
  compiler: TranslateCompiler;
  parser: TranslateParser;
  missingTranslationHandler: MissingTranslationHandler;

  get onTranslationChange(): EventEmitter<TranslationChangeEvent> {
    return new EventEmitter<TranslationChangeEvent>();
  }

  get onLangChange(): EventEmitter<LangChangeEvent> {
    return new EventEmitter<LangChangeEvent>();
  }

  get onDefaultLangChange(): EventEmitter<DefaultLangChangeEvent> {
    return new EventEmitter<DefaultLangChangeEvent>();
  }

  get defaultLang() {
    return '';
  }
  set defaultLang(defaultLang: string) {}

  get currentLang() {
    return '';
  }
  set currentLang(currentLang: string) {

  }

  get langs() {
    return [''];
  }
  set langs(langs: string[]) {

  }
  get translations() {
    return '';
  }
  set translations(translations: any) {

  }

  setDefaultLang(lang: string) {

  }

  getDefaultLang() {
    return '';
  }

  use(lang: string) {
    return of('');
  }

  getTranslation(lang: string) {
    return of('');
  }

  setTranslation(lang: string, translations: Object, shouldMerge?: boolean) {
    return '';
  }

  getLangs() {
    return [''];
  }

  addLangs(langs: Array<string>) {

  }

  getParsedResult(translations: any, key: any, interpolateParams?: Object) {
    return {};
  }

  get(key: string | Array<string>, interpolateParams?: Object) {
    return of('');
  }

  getStreamOnTranslationChange(key: string | Array<string>, interpolateParams?: Object) {
    return of('');
  }

  stream(key: string | Array<string>, interpolateParams?: Object) {
    return of('');
  }

  instant(key: string | Array<string>, interpolateParams?: Object) {
    return '';
  }

  set(key: string, value: string, lang?: string) {

  }

  reloadLang(lang: string) {
    return of({});
  }

  resetLang(lang: string) {

  }

  getBrowserLang(): string {
    return '';
  }

  getBrowserCultureLang() {
    return '';
  }

}
