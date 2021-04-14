import { categoryBTestResultMock } from '@shared/mocks/cat-b-test-result.mock';
import { bookedTestSlotMock } from '@shared/mocks/test-slot-data.mock';

export class CompressionProviderMock {

  extractTestResult = jasmine.createSpy('extractTestResult').and.returnValue(categoryBTestResultMock);

  extractTestSlotResult() {
    return bookedTestSlotMock;
  }

}
