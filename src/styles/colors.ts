import { palette } from "./theme";

// Semantic aliases kept so existing screens pick up the palette without edits.
// New code should import from ./theme directly.
export const colors = {
  primary_yellow: palette.rose,
  light_yellow: palette.rose_soft,
  text_primary: palette.ink,
  text_gray: palette.ink_muted,
  text_gray_light: palette.ink_faint,

  icon_stroke: palette.ink,
  screen_background: palette.cream,
  thumbnail_background: palette.blush,

  background_dim: palette.scrim,

  tag_dark: palette.ink,
  tag_dark_disabled: palette.ink_muted,
  tag_light: palette.blush,
  tag_dark_text: palette.cream,
  tag_dark_text_disabled: palette.ink_faint,
  tag_light_text: palette.ink_muted,

  divider_light: palette.line,
  border_gray: palette.line_strong,
  border_gray_light: palette.line,

  primary_red: palette.danger,
};
