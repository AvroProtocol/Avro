export const THEME = {
  colors: {
    background: "#000000",
    surface: "#0b0b0b",
    surfaceElevated: "#121212",
    surfaceGlass: "rgba(12, 12, 12, 0.88)",

    border: "rgba(255, 255, 255, 0.12)",
    borderSubtle: "rgba(255, 255, 255, 0.06)",
    borderHighlight: "rgba(255, 255, 255, 0.28)",

    textPrimary: "#ffffff",
    textSecondary: "#b7b7b2",
    textMuted: "#858580",
    textDim: "#5d5d59",

    accent: "#ffffff",
    accentMuted: "rgba(255, 255, 255, 0.10)",
    accentGlow: "rgba(255, 255, 255, 0.22)",

    secondary: "#ffffff",
    secondaryMuted: "rgba(255, 255, 255, 0.1)",

    danger: "#ef4444",
    dangerMuted: "rgba(239, 68, 68, 0.12)",
    success: "#ffffff",
    successMuted: "rgba(255, 255, 255, 0.10)",
    warning: "#d4d4d4",
    warningMuted: "rgba(212, 212, 212, 0.10)",
  },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24 },
  borderRadius: { sm: 8, md: 12, lg: 16, xl: 20, full: 9999 },
} as const;
