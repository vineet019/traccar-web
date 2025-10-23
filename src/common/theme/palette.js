const validatedColor = (color) => (/^#([0-9A-Fa-f]{3}){1,2}$/.test(color) ? color : null);

export default (server, darkMode) => ({
  mode: darkMode ? 'dark' : 'light',
  background: {
    default: darkMode ? '#000000' : '#fafafa',
    paper: darkMode ? '#1c1c1e' : '#ffffff',
  },
  primary: {
    main: validatedColor(server?.attributes?.colorPrimary) || (darkMode ? '#ffffff' : '#000000'),
    light: darkMode ? '#f5f5f5' : '#333333',
    dark: darkMode ? '#e0e0e0' : '#000000',
    contrastText: darkMode ? '#000000' : '#ffffff',
  },
  secondary: {
    main: validatedColor(server?.attributes?.colorSecondary) || '#007aff',
    light: '#5ac8fa',
    dark: '#0051d5',
    contrastText: '#ffffff',
  },
  neutral: {
    main: darkMode ? '#8e8e93' : '#8e8e93',
  },
  geometry: {
    main: '#007aff',
  },
  alwaysDark: {
    main: '#000000',
  },
  success: {
    main: '#34c759',
    light: '#63d77e',
  },
  error: {
    main: '#ff3b30',
    light: '#ff6259',
  },
  warning: {
    main: '#ff9500',
    light: '#ffaa33',
  },
  text: {
    primary: darkMode ? '#ffffff' : '#000000',
    secondary: darkMode ? '#98989d' : '#6e6e73',
  },
  divider: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
});
