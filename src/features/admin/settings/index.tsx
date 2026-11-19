"use client"

import { GlassControlPanel } from './components/glass-control-panel'
import { OverlayControlPanel } from './components/overlay-control-panel'
import { TextControlPanel } from './components/text-control-panel'

export function AdminSettingsFeature() {
  return (
    <section className="cms-settings-page cms-settings-page--blur-test">
      <h1 className="cms-settings-blur-title">Cài đặt</h1>
      <GlassControlPanel />
      <TextControlPanel />
      <OverlayControlPanel />
    </section>
  )
}
