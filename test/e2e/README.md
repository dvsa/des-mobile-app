
# Example template for test.config.ts

If you see the error `Error: Cannot find module '../test.config'` then you need to add the test.config.js file here.

NOTE: This file should not be checked in to git. It is included in .gitignore.

```export const TEST_CONFIG = {
  users: {
    mobexaminer: { username: '<USERNAME-HERE>', password: '<PASSWORD-HERE>', employeeId: '12345678' },
    mobexaminer1: { username: '<USERNAME-HERE>', password: '<PASSWORD-HERE>', employeeId: '01234567' },
    mobexaminer2: { username: '<USERNAME-HERE>', password: '<PASSWORD-HERE>', employeeId: '00123456' },
    mobexaminer3: { username: '<USERNAME-HERE>', password: '<PASSWORD-HERE>', employeeId: '28371932' },
    mobexaminer4: { username: '<USERNAME-HERE>', password: '<PASSWORD-HERE>', employeeId: '90128472' },
    mobexaminer5: { username: '<USERNAME-HERE>', password: '<PASSWORD-HERE>', employeeId: '47182032' },
    mobexaminer6: { username: '<USERNAME-HERE>', password: '<PASSWORD-HERE>', employeeId: '78471231' },
    mobexaminer7: { username: '<USERNAME-HERE>', password: '<PASSWORD-HERE>', employeeId: '67128492' },
  },
  PAGE_LOAD_WAIT: 3000,
  ACTION_WAIT: 500,
  DEFAULT_TIMEOUT: 60000,
};
```