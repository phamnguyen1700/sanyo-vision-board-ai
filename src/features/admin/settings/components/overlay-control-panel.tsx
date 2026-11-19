'use client'

import { useGlassSettings } from '@/hooks/cms/use-glass-settings'

export function OverlayControlPanel() {
  const { glassSettings, setGlassSettings } = useGlassSettings()

  return (
    <section className="cms-settings-panel cms-glass">
      <div className="cms-settings-panel__header cms-settings-panel__header--stacked">
        <div className="cms-settings-panel__heading">
          <h2 className="cms-settings-panel__title">Overlay glass</h2>
          <p className="cms-settings-panel__description">Màu của card nằm trên lớp glass chính.</p>
        </div>
      </div>
      <div className="cms-settings-controls">
        <label className="cms-settings-control cms-settings-control--row">
          <span className="cms-settings-control__label">
            <span>Light overlay</span>
            <output>{glassSettings.lightOverlay}</output>
          </span>
          <input className="cms-settings-color" type="color" value={glassSettings.lightOverlay}
            onChange={(event) => setGlassSettings({ ...glassSettings, lightOverlay: event.target.value })} />
        </label>
        <label className="cms-settings-control cms-settings-control--row">
          <span className="cms-settings-control__label">
            <span>Dark overlay</span>
            <output>{glassSettings.darkOverlay}</output>
          </span>
          <input className="cms-settings-color" type="color" value={glassSettings.darkOverlay}
            onChange={(event) => setGlassSettings({ ...glassSettings, darkOverlay: event.target.value })} />
        </label>
      </div>
    </section>
  )
}
