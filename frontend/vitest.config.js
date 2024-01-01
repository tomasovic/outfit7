import {fileURLToPath} from 'node:url'
import {configDefaults, defineConfig, mergeConfig} from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      server: {
        deps: {
          inline: ['vuetify'],
        },
      },
      environment: 'jsdom',
      css: {
        modules: {
          classNameStrategy: 'non-scoped'
        }
      },
      exclude: [...configDefaults.exclude, 'e2e/*'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      globals: true,
      transformMode: {
        web: [/.[jt]sx?$/, /\.vue$/, /\.css$/],
      },
      setupFiles: './tests/setup.js',
      // transform: {
      //   '^.+\\.css$': css(),
      // }
    }
  })
)
