// Design tokens. Everything visual should come from here rather than literal
// values, so the look can be tuned in one place.

export const palette = {
  // Surfaces
  cream: "#FDF8F5", // app background
  shell: "#FFFFFF", // raised cards
  blush: "#F7EDE8", // tinted fills, thumbnail beds
  blush_deep: "#F0DDD6", // hover/pressed tint, dividers on tinted ground

  // Accents
  rose: "#E8A0A0", // primary accent
  rose_deep: "#D4797C", // pressed / emphasis
  rose_soft: "#F6DEDC", // accent fills behind rose text
  gold: "#C9A227", // secondary accent, a nod to the original mustard
  gold_soft: "#F5E9C8",

  // Ink
  ink: "#3D3436", // primary text
  ink_muted: "#7A6B6D", // secondary text
  ink_faint: "#B3A5A6", // tertiary text, placeholders

  // Lines
  line: "#EFE4E0",
  line_strong: "#E2D2CD",

  // Status
  danger: "#C4564F",

  // Scrims
  scrim: "rgba(61, 52, 54, 0.32)",
} as const;

// 4pt scale. Use these instead of arbitrary numbers.
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

export const fontFamily = {
  // Serif, for display headings only
  display: "PlayfairDisplay-Bold",
  displayMedium: "PlayfairDisplay-Medium",

  // Sans, for everything else
  regular: "PlusJakartaSans-Regular",
  medium: "PlusJakartaSans-Medium",
  semiBold: "PlusJakartaSans-SemiBold",
  bold: "PlusJakartaSans-Bold",
} as const;

export const fontSize = {
  display: 30,
  title: 22,
  heading: 17,
  body: 15,
  label: 13,
  caption: 11,
} as const;

// Soft, low-contrast elevation. Shadows here are felt more than seen.
export const shadow = {
  soft: {
    shadowColor: palette.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  lifted: {
    shadowColor: palette.ink,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
} as const;
