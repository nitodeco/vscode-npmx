import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

const rootDir = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      vscode: join(rootDir, '/tests/__mocks__/vscode.ts'),
    },
  },
  test: {
    include: ['tests/**/*.test.ts'],
  },
})
