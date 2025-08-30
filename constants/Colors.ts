const tintColorLight = '#4F46E5';
const tintColorDark = '#6366F1';

export default {
  light: {
    text: '#000',
    background: '#ffffff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
    primary: '#4F46E5',
    secondary: '#6366F1',
    accent: '#F59E0B',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    surface: '#ffffff',
    surfaceVariant: '#f8fafc',
    border: '#e2e8f0',
    card: '#ffffff',
    textSecondary: '#64748b',
    textTertiary: '#94a3b8',
  },
  dark: {
    text: '#ffffff',
    background: '#0f172a',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
    primary: '#6366F1',
    secondary: '#818CF8',
    accent: '#F59E0B',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    surface: '#1e293b',
    surfaceVariant: '#334155',
    border: '#475569',
    card: '#1e293b',
    textSecondary: '#94a3b8',
    textTertiary: '#cbd5e1',
  },
};

// CUT Brand Colors
export const cutColors = {
  primary: '#4F46E5', // CUT Blue
  secondary: '#6366F1', // CUT Blue Light
  accent: '#F59E0B', // CUT Orange
  success: '#10B981', // Green
  warning: '#F59E0B', // Orange
  error: '#EF4444', // Red
  info: '#3B82F6', // Blue
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
};

// Status Colors
export const statusColors = {
  available: '#10B981', // Green
  assigned: '#3B82F6', // Blue
  maintenance: '#F59E0B', // Orange
  retired: '#6B7280', // Gray
  pending: '#F59E0B', // Orange
  approved: '#10B981', // Green
  rejected: '#EF4444', // Red
  completed: '#10B981', // Green
};

// Priority Colors
export const priorityColors = {
  low: '#10B981', // Green
  medium: '#F59E0B', // Orange
  high: '#F97316', // Orange Dark
  urgent: '#EF4444', // Red
};
