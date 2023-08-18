import path from 'path'
import { defineConfig } from 'vitest/config'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

export default defineConfig({
  resolve: {
    alias: {
      app: path.resolve(__dirname, './app'),
      components: path.resolve(__dirname, './components'),
      hooks: path.resolve(__dirname, './hooks'),
      public: path.resolve(__dirname, './public'),
    },
  },
  test: {
    coverage: {
      provider: 'v8',
    },
  },
})
