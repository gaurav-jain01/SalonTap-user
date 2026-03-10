import { Platform, StyleSheet } from 'react-native';

// ────────────────────────────────────────────────────────────────
// 🎨 Global Color Palette
// ────────────────────────────────────────────────────────────────
export const Colors = {
  // Primary brand colors
  primary: '#0a7ea4',
  primaryLight: '#38a8c9',
  primaryDark: '#066580',

  // Neutral palette
  white: '#FFFFFF',
  black: '#000000',
  dark: '#1a1a1a',
  text: '#11181C',
  textSecondary: '#666666',
  textMuted: '#888888',
  textLight: '#999999',
  textDark: '#333333',
  textBody: '#444444',

  // Background palette
  background: '#FFFFFF',
  backgroundSecondary: '#fafafa',
  backgroundTertiary: '#f5f5f5',

  // Border palette
  border: '#f0f0f0',
  borderLight: '#eee',
  borderMedium: '#ddd',

  // Status colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#FF6B6B',
  info: '#2196F3',

  // Category colors
  category: {
    haircut:  { color: '#FF6B6B', bg: '#FFE5E5' },
    massage:  { color: '#4CAF50', bg: '#E8F5E9' },
    coloring: { color: '#FF9800', bg: '#FFF3E0' },
    facial:   { color: '#9C27B0', bg: '#F3E5F5' },
    makeup:   { color: '#E91E63', bg: '#FCE4EC' },
    nails:    { color: '#00BCD4', bg: '#E0F7FA' },
  },

  // Pagination
  paginationInactive: '#cccccc',

  // Shadow color
  shadow: '#000000',

  // Legacy compatibility
  light: {
    text: '#11181C',
    background: '#fff',
    tint: '#0a7ea4',
    icon: '#248bdaff',
    tabIconDefault: '#687076',
    tabIconSelected: '#0a7ea4',
  },
};

// ────────────────────────────────────────────────────────────────
// 📐 Spacing & Sizing
// ────────────────────────────────────────────────────────────────
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  round: 9999,
};

export const IconSize = {
  sm: 16,
  md: 22,
  lg: 24,
  xl: 32,
};

// ────────────────────────────────────────────────────────────────
// 🔤 Typography
// ────────────────────────────────────────────────────────────────
export const Typography = {
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.dark,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: Colors.textDark,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.dark,
    letterSpacing: -0.5,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.text,
  },
  bodySmall: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  caption: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textBody,
  },
  button: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: Colors.white,
  },
  link: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
};

// ────────────────────────────────────────────────────────────────
// 🌑 Shadows
// ────────────────────────────────────────────────────────────────
export const Shadows = {
  sm: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  lg: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
};

// ────────────────────────────────────────────────────────────────
// 📦 Common / Global Styles
// ────────────────────────────────────────────────────────────────
export const GlobalStyles = StyleSheet.create({
  // Screens
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  screenPadding: {
    padding: Spacing.xl,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.backgroundSecondary,
  },

  // Center
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Rows
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Primary Button
  primaryButton: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.lg,
  },
  primaryButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Input
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderMedium,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    height: 56,
    backgroundColor: Colors.white,
  },

  // Separator
  separator: {
    height: 1,
    backgroundColor: Colors.borderLight,
  },

  // Section
  sectionPadding: {
    paddingHorizontal: Spacing.xl,
  },
});

// ────────────────────────────────────────────────────────────────
// 🖋️ Fonts
// ────────────────────────────────────────────────────────────────
export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
