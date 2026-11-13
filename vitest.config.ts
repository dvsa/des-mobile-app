import { availableParallelism } from 'node:os';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    pool: 'threads',
    maxWorkers: Math.min(8, availableParallelism()),
    isolate: false,
    clearMocks: true,
    restoreMocks: true,
    unstubGlobals: true,
    testTimeout: 30000,
    hookTimeout: 30000,
    coverage: {
      reportsDirectory: 'coverage/vitest',
    },
  },
});
