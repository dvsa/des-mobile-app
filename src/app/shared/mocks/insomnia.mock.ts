export class InsomniaMock {
  keepAwake = jasmine.createSpy('keepAwake').and.returnValue(Promise.resolve());
  allowSleepAgain = jasmine.createSpy('allowSleepAgain');
}
