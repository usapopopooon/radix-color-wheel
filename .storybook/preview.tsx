import React, { useEffect } from 'react'
import type { Preview, Decorator } from '@storybook/react-vite'
import { themes } from 'storybook/theming'
import { addons } from 'storybook/preview-api'
import { DARK_MODE_EVENT_NAME } from '@vueless/storybook-dark-mode'
import '../src/styles.css'

// Decorator to handle dark mode background
const withDarkMode: Decorator = (Story) => {
  useEffect(() => {
    const channel = addons.getChannel()

    const handleDarkMode = (isDark: boolean) => {
      document.body.classList.toggle('dark', isDark)
      document.body.classList.toggle('light', !isDark)
      document.body.style.backgroundColor = isDark ? '#1a1a1a' : '#ffffff'
      document.body.style.color = isDark ? '#ffffff' : '#000000'
    }

    channel.on(DARK_MODE_EVENT_NAME, handleDarkMode)

    return () => {
      channel.off(DARK_MODE_EVENT_NAME, handleDarkMode)
    }
  }, [])

  return <Story />
}

const preview: Preview = {
  tags: ['autodocs'],
  decorators: [withDarkMode],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      disable: true,
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
