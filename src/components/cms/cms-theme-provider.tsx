'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

import {
  CMS_GLASS_SETTINGS_STORAGE_KEY,
  CMS_THEME_STORAGE_KEY,
  DEFAULT_CMS_GLASS_SETTINGS,
  type CmsGlassSettings,
  type CmsTheme,
} from '@/lib/cms/theme'
import { CmsToaster } from '@/components/common/cms-toast'

interface CmsThemeContextValue {
  theme: CmsTheme
  setTheme: (theme: CmsTheme) => void
  toggleTheme: () => void
  glassSettings: CmsGlassSettings
  setGlassSettings: (settings: CmsGlassSettings) => void
  resetGlassSettings: () => void
}

const CmsThemeContext = createContext<CmsThemeContextValue | null>(null)

interface CmsThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: CmsTheme
}

export function CmsThemeProvider({
  children,
  defaultTheme = 'light',
}: CmsThemeProviderProps) {
  const [theme, setTheme] = useState<CmsTheme>(defaultTheme)
  const [glassSettings, setGlassSettings] = useState<CmsGlassSettings>(
    DEFAULT_CMS_GLASS_SETTINGS,
  )
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    const savedTheme = window.localStorage.getItem(CMS_THEME_STORAGE_KEY)
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme)
    }

    const savedSettings = window.localStorage.getItem(CMS_GLASS_SETTINGS_STORAGE_KEY)
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings) as Partial<CmsGlassSettings>
        const mergedSettings = {
          ...DEFAULT_CMS_GLASS_SETTINGS,
          ...parsedSettings,
        }

        if (parsedSettings.lightTint?.toLowerCase() === '#000000') {
          mergedSettings.lightTint = '#ffffff'
        }

        if (parsedSettings.darkTint?.toLowerCase() === '#ffffff') {
          mergedSettings.darkTint = '#000000'
        }

        setGlassSettings({
          ...mergedSettings,
        })
      } catch {
        window.localStorage.removeItem(CMS_GLASS_SETTINGS_STORAGE_KEY)
      }
    }

    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (!isHydrated) return
    window.localStorage.setItem(CMS_THEME_STORAGE_KEY, theme)
  }, [isHydrated, theme])

  useEffect(() => {
    if (!isHydrated) return
    window.localStorage.setItem(
      CMS_GLASS_SETTINGS_STORAGE_KEY,
      JSON.stringify(glassSettings),
    )
  }, [glassSettings, isHydrated])

  const glassStyle = useMemo(
    () =>
      ({
        '--cms-glass-blur': `${glassSettings.blur}px`,
        '--cms-glass-tint-opacity': glassSettings.tintOpacity,
        '--cms-glass-refraction': glassSettings.refraction,
        '--cms-glass-ior': glassSettings.ior,
        '--cms-glass-magnify': glassSettings.magnify,
        '--cms-glass-thickness': `${glassSettings.thickness}px`,
        '--cms-glass-bevel-width': `${glassSettings.bevelWidth}px`,
        '--cms-glass-dispersion': glassSettings.dispersion,
        '--cms-glass-specular': glassSettings.specular,
        '--cms-glass-saturation': glassSettings.saturation,
        '--cms-glass-frost': glassSettings.frost,
        '--cms-glass-motion-light': glassSettings.motionLight ? 1 : 0,
        '--cms-glass-tint': theme === 'dark'
          ? glassSettings.darkTint
          : glassSettings.lightTint,
        '--cms-overlay-color': theme === 'dark'
          ? glassSettings.darkOverlay
          : glassSettings.lightOverlay,
        '--cms-glass-surface': theme === 'dark'
          ? 'rgba(255, 255, 255, 0.04)'
          : 'rgba(0, 0, 0, 0.04)',
        '--cms-font-family': glassSettings.fontFamily === 'inter'
          ? 'Inter, ui-sans-serif, system-ui, sans-serif'
          : glassSettings.fontFamily === 'arial'
            ? 'Arial, sans-serif'
            : glassSettings.fontFamily === 'trebuchet'
              ? '"Trebuchet MS", sans-serif'
              : 'ui-sans-serif, system-ui, sans-serif',
        '--cms-text-weight': glassSettings.fontWeight,
        '--cms-text-display': `${glassSettings.textDisplay}rem`,
        '--cms-text-title': `${glassSettings.textTitle}rem`,
        '--cms-text-heading': `${glassSettings.textHeading}rem`,
        '--cms-text-subheading': `${glassSettings.textSubheading}rem`,
        '--cms-text-body-lg': `${glassSettings.textBodyLg}rem`,
        '--cms-text-body': `${glassSettings.textBody}rem`,
        '--cms-text-label': `${glassSettings.textLabel}rem`,
        '--cms-text-caption': `${glassSettings.textCaption}rem`,
      }) as React.CSSProperties,
    [glassSettings, theme],
  )

  useEffect(() => {
    const root = document.documentElement

    Object.entries(glassStyle).forEach(([property, value]) => {
      root.style.setProperty(property, String(value))
    })

    return () => {
      Object.keys(glassStyle).forEach((property) => root.style.removeProperty(property))
    }
  }, [glassStyle])

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme: () => setTheme((current) => (current === 'light' ? 'dark' : 'light')),
      glassSettings,
      setGlassSettings,
      resetGlassSettings: () =>
        setGlassSettings({
          ...DEFAULT_CMS_GLASS_SETTINGS,
        }),
    }),
    [glassSettings, theme],
  )

  return (
    <CmsThemeContext.Provider value={value}>
      <div
        className={`cms-theme ${theme === 'dark' ? 'dark' : ''} ${glassSettings.motionLight ? 'cms-motion-light' : ''}`}
        data-cms-theme={theme}
        style={glassStyle}
      >
        {children}
        <CmsToaster />
      </div>
    </CmsThemeContext.Provider>
  )
}

export function useCmsTheme() {
  const context = useContext(CmsThemeContext)
  if (!context) {
    throw new Error('useCmsTheme must be used inside CmsThemeProvider')
  }

  return context
}
