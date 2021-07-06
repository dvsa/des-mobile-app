import { getTestData as getTestDataCatH } from '@store/tests/test-data/cat-home/test-data.cat-h.reducer';

export class TestDataByCategoryProviderMock {
  getTestDataByCategoryCode() {
    return getTestDataCatH;
  }
}
