import { grey } from '@mui/material/colors';

const validatedColor = (color) => (/^#([0-9A-Fa-f]{3}){1,2}$/.test(color) ? color : null);

export default (server, darkMode) => ({
  mode: darkMode ? 'dark' : 'light',
  background: {
    default: darkMode ? '#0a0e27' : '#f8fafc',
    paper: darkMode ? '#1a1f3a' : '#ffffff',
  },
  primary: {
    main: validatedColor(server?.attributes?.colorPrimary) || (darkMode ? '#60a5fa' : '#2563eb'),
    light: darkMode ? '#93c5fd' : '#3b82f6',
    dark: darkMode ? '#3b82f6' : '#1e40af',
    contrastText: '#ffffff',
  },
  secondary: {
    main: validatedColor(server?.attributes?.colorSecondary) || (darkMode ? '#34d399' : '#059669'),
    light: darkMode ? '#6ee7b7' : '#10b981',
    dark: darkMode ? '#10b981' : '#047857',
    contrastText: '#ffffff',
  },
  neutral: {
    main: grey[500],
  },
  geometry: {
    main: '#3bb2d0',
  },
  alwaysDark: {
    main: grey[900],
  },
  success: {
    main: darkMode ? '#34d399' : '#059669',
    light: darkMode ? '#6ee7b7' : '#10b981',
  },
  error: {
    main: darkMode ? '#f87171' : '#dc2626',
    light: darkMode ? '#fca5a5' : '#ef4444',
  },
  warning: {
    main: darkMode ? '#fbbf24' : '#d97706',
    light: darkMode ? '#fcd34d' : '#f59e0b',
  },
  text: {
    primary: darkMode ? '#f1f5f9' : '#1e293b',
    secondary: darkMode ? '#94a3b8' : '#475569',
  },
  divider: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
});
