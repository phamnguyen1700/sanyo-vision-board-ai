export type CmsTheme = "light" | "dark";
export type CmsFontFamily = "system" | "inter" | "arial" | "trebuchet";

export const CMS_THEME_STORAGE_KEY = "sanyo-cms-theme";
export const CMS_GLASS_SETTINGS_STORAGE_KEY = "sanyo-cms-glass-settings-v2";

export interface CmsGlassSettings {
  blur: number;
  tintOpacity: number;
  refraction: number;
  ior: number;
  magnify: number;
  thickness: number;
  bevelWidth: number;
  dispersion: number;
  specular: number;
  saturation: number;
  frost: number;
  motionLight: boolean;
  lightTint: string;
  darkTint: string;
  lightOverlay: string;
  darkOverlay: string;
  fontFamily: CmsFontFamily;
  fontWeight: number;
  textDisplay: number;
  textTitle: number;
  textHeading: number;
  textSubheading: number;
  textBodyLg: number;
  textBody: number;
  textLabel: number;
  textCaption: number;
}

export const DEFAULT_CMS_GLASS_SETTINGS: CmsGlassSettings = {
  blur: 4,
  tintOpacity: 0.12,
  refraction: 0.5,
  ior: 1.5,
  magnify: 0,
  thickness: 6,
  bevelWidth: 0,
  dispersion: 0,
  specular: 0.25,
  saturation: 1,
  frost: 0,
  motionLight: true,
  lightTint: "#ffffff",
  darkTint: "#000000",
  lightOverlay: "#ffffff",
  darkOverlay: "#000000",
  fontFamily: "system",
  fontWeight: 400,
  textDisplay: 4.5,
  textTitle: 2.875,
  textHeading: 2,
  textSubheading: 1.75,
  textBodyLg: 1.25,
  textBody: 1.125,
  textLabel: 1,
  textCaption: 0.875,
};
