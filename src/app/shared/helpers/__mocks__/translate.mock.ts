import { vi } from 'vitest';
export const translateServiceMock = {
  setFallbackLang: vi.fn().mockName('TranslateService.setFallbackLang'),
};
