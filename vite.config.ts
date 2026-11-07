import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: '/BavisMeeCan/',
  test: { include: ['src/**/*.test.ts'] },
});
