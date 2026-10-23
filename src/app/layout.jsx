import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import ThemeRegistry from '@/components/providers/ThemeRegistry';
import { THEME_ATTRIBUTE, THEME_STORAGE_KEY } from '@/lib/theme';
import AppShell from '@/components/device/AppShell';

const serif = Cormorant_Garamond({ subsets: ['latin'], weight: ['400', '500', '600'], style: ['normal', 'italic'], variable: '--font-serif' });
const sans = Manrope({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-sans' });

export const metadata = {
  title: 'VOID. — Endless',
  description: 'Demo e-commerce experience: an editorial men’s & women’s clothing store.',
};

export const viewport = { themeColor: '#f6f2ea', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <body className="font-sans">
        <InitColorSchemeScript attribute={THEME_ATTRIBUTE} modeStorageKey={THEME_STORAGE_KEY} defaultMode="light" />
        <ThemeRegistry>
          <AppShell>{children}</AppShell>
        </ThemeRegistry>
      </body>
    </html>
  );
}
