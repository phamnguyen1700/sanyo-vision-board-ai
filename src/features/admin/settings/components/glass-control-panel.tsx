'use client'

import { Moon, Sun } from 'lucide-react'

import { useCmsTheme } from '@/components/cms'
import { Button } from '@/components/ui/button'
import { useGlassSettings } from '@/hooks/cms/use-glass-settings'

export function GlassControlPanel() {
  const { glassSettings, setGlassSettings } = useGlassSettings()
  const { theme, toggleTheme } = useCmsTheme()

  return (
    <section className="cms-settings-panel cms-glass">
      <div className="cms-settings-panel__header">
        <Button type="button" variant="outline" size="sm" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun /> : <Moon />}
          {theme === 'dark' ? 'Sáng' : 'Tối'}
        </Button>
      </div>

      <div className="cms-settings-controls">
        <label className="cms-settings-control">
          <span className="cms-settings-control__label">
            <span>Blur</span>
            <output>{glassSettings.blur.toFixed(1)}px</output>
          </span>
          <input
            type="range"
            min={0}
            max={32}
            step={0.1}
            value={glassSettings.blur}
            onChange={(event) =>
              setGlassSettings({
                ...glassSettings,
                blur: Number(event.target.value),
              })
            }
          />
        </label>

        <label className="cms-settings-control cms-settings-control--row">
          <span className="cms-settings-control__label">
            <span>Light glass</span>
            <output>{glassSettings.lightTint}</output>
          </span>
          <input
            className="cms-settings-color"
            type="color"
            value={glassSettings.lightTint}
            onChange={(event) =>
              setGlassSettings({
                ...glassSettings,
                lightTint: event.target.value,
              })
            }
          />
        </label>

        <label className="cms-settings-control cms-settings-control--row">
          <span className="cms-settings-control__label">
            <span>Dark glass</span>
            <output>{glassSettings.darkTint}</output>
          </span>
          <input
            className="cms-settings-color"
            type="color"
            value={glassSettings.darkTint}
            onChange={(event) =>
              setGlassSettings({
                ...glassSettings,
                darkTint: event.target.value,
              })
            }
          />
        </label>
      </div>
    </section>
  )
}
