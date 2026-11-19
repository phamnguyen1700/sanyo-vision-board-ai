'use client'

import { useGlassSettings } from '@/hooks/cms/use-glass-settings'
import type { CmsFontFamily } from '@/lib/cms/theme'

const textControls = [
  { key: 'textDisplay', label: 'Display', min: 3, max: 6, step: 0.125 },
  { key: 'textTitle', label: 'Title', min: 2, max: 4, step: 0.125 },
  { key: 'textHeading', label: 'Heading', min: 1.5, max: 3, step: 0.125 },
  { key: 'textSubheading', label: 'Subheading', min: 1.25, max: 2.5, step: 0.125 },
  { key: 'textBodyLg', label: 'Body large', min: 1, max: 1.75, step: 0.0625 },
  { key: 'textBody', label: 'Body', min: 0.875, max: 1.5, step: 0.0625 },
  { key: 'textLabel', label: 'Label', min: 0.75, max: 1.25, step: 0.0625 },
  { key: 'textCaption', label: 'Caption', min: 0.625, max: 1, step: 0.0625 },
] as const

type TextSizeKey = (typeof textControls)[number]['key']

export function TextControlPanel() {
  const { glassSettings, setGlassSettings } = useGlassSettings()

  const updateTextSize = (key: TextSizeKey, value: number) => {
    setGlassSettings({ ...glassSettings, [key]: value })
  }

  return (
    <section className="cms-settings-panel cms-glass">
      <div className="cms-settings-panel__header cms-settings-panel__header--stacked">
        <div className="cms-settings-panel__heading">
          <h2 className="cms-settings-panel__title">Text</h2>
          <p className="cms-settings-panel__description">Font, độ đậm và kích thước chữ cho CMS.</p>
        </div>
      </div>
      <div className="cms-settings-controls">
        <label className="cms-settings-control cms-settings-control--row">
          <span className="cms-settings-control__label"><span>Font family</span></span>
          <select
            className="cms-settings-select"
            value={glassSettings.fontFamily}
            onChange={(event) => setGlassSettings({
              ...glassSettings,
              fontFamily: event.target.value as CmsFontFamily,
            })}
          >
            <option value="system">System</option>
            <option value="inter">Inter</option>
            <option value="arial">Arial</option>
            <option value="trebuchet">Trebuchet MS</option>
          </select>
        </label>
        <label className="cms-settings-control cms-settings-control--row">
          <span className="cms-settings-control__label"><span>Độ đậm</span></span>
          <select
            className="cms-settings-select"
            value={glassSettings.fontWeight}
            onChange={(event) => setGlassSettings({
              ...glassSettings,
              fontWeight: Number(event.target.value),
            })}
          >
            <option value={400}>Regular 400</option>
            <option value={500}>Medium 500</option>
            <option value={600}>Semibold 600</option>
            <option value={700}>Bold 700</option>
            <option value={800}>Extra bold 800</option>
          </select>
        </label>
        {textControls.map((control) => (
          <label key={control.key} className="cms-settings-control">
            <span className="cms-settings-control__label">
              <span>{control.label}</span>
              <output>{glassSettings[control.key].toFixed(3)}rem</output>
            </span>
            <input
              type="range"
              min={control.min}
              max={control.max}
              step={control.step}
              value={glassSettings[control.key]}
              onChange={(event) => updateTextSize(control.key, Number(event.target.value))}
            />
          </label>
        ))}
      </div>
    </section>
  )
}
