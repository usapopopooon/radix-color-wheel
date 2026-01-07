import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-vitest',
    '@vueless/storybook-dark-mode',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {
      builder: {
        viteConfigPath: 'vite.config.ts',
      },
    },
  },
  core: {
    disableTelemetry: true,
  },
  viteFinal: async (config) => {
    // Filter out vite-plugin-dts to avoid build errors in Storybook
    const filteredPlugins = (config.plugins ?? []).filter((plugin) => {
      if (plugin && typeof plugin === 'object' && 'name' in plugin) {
        return plugin.name !== 'vite:dts'
      }
      return true
    })

    return {
      ...config,
      plugins: filteredPlugins,
      optimizeDeps: {
        ...config.optimizeDeps,
        include: [
          ...(config.optimizeDeps?.include ?? []),
          'react/jsx-dev-runtime',
          'storybook/preview-api',
          'storybook/theming',
          '@vueless/storybook-dark-mode',
        ],
      },
    }
  },
}
export default config
