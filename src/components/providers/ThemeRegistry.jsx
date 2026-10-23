'use client';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { THEME_ATTRIBUTE, THEME_STORAGE_KEY } from '@/lib/theme';

// MUI writes data-theme="light" | "dark" on <html>; globals.css keys the Tailwind/Bootstrap palette off the same attribute.
const theme = createTheme({
  cssVariables: { colorSchemeSelector: THEME_ATTRIBUTE },
  defaultColorScheme: 'light',
  colorSchemes: {
    light: {
      palette: {
        primary: { main: '#161514', contrastText: '#f6f2ea' },
        secondary: { main: '#a64a26' },
        background: { default: '#f6f2ea', paper: '#f6f2ea' },
        text: { primary: '#161514', secondary: '#706a62' },
        divider: 'rgba(22,21,20,0.12)',
      },
    },
    dark: {
      palette: {
        primary: { main: '#f1ece3', contrastText: '#161514' },
        secondary: { main: '#da8058' },
        background: { default: '#161514', paper: '#1c1b19' },
        text: { primary: '#f1ece3', secondary: '#a0988d' },
        divider: 'rgba(241,236,227,0.12)',
      },
    },
  },
  shape: { borderRadius: 0 },
  typography: {
    fontFamily: 'var(--font-sans), system-ui, sans-serif',
    button: { textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.18em', fontSize: 12 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { paddingInline: 28, paddingBlock: 14 }, sizeSmall: { paddingInline: 16, paddingBlock: 8 } },
    },
    MuiChip: { styleOverrides: { root: { borderRadius: 0, fontWeight: 500, letterSpacing: '0.04em' } } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiDrawer: { styleOverrides: { paper: ({ theme }) => ({ backgroundColor: theme.vars.palette.background.default }) } },
    MuiTooltip: { styleOverrides: { tooltip: { background: '#161514', color: '#f6f2ea', fontSize: 11, borderRadius: 0, letterSpacing: '0.04em' } } },
    MuiAlert: { styleOverrides: { root: { borderRadius: 0 } } },
  },
});

export default function ThemeRegistry({ children }) {
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: false }}>
      <ThemeProvider theme={theme} defaultMode="light" modeStorageKey={THEME_STORAGE_KEY} disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
