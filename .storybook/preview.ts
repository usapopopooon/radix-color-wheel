import type { Preview } from '@storybook/react-vite'
import { themes } from 'storybook/theming'
import '../src/styles.css'

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#1a1a1a' },
      ],
    },
    darkMode: {
      current: 'light',
      dark: {
        ...themes.dark,
        appBg: '#1a1a1a',
        appContentBg: '#1a1a1a',
        barBg: '#1a1a1a',
      },
      light: {
        ...themes.light,
        appBg: '#ffffff',
        appContentBg: '#ffffff',
        barBg: '#ffffff',
      },
      stylePreview: true,
      darkClass: 'dark',
      lightClass: 'light',
      classTarget: 'body',
    },
  },
}

export default preview
