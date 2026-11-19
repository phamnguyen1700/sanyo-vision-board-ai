import { useCmsTheme } from '@/components/cms'

export function useGlassSettings() {
  const { glassSettings, setGlassSettings, resetGlassSettings } = useCmsTheme()

  return {
    glassSettings,
    setGlassSettings,
    resetGlassSettings,
  }
}
