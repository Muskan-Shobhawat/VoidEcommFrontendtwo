'use client';
import { useEffect, useState } from 'react';
import { useDevice } from '@/store/device';
import DeviceStage from './DeviceStage';
import DeviceToggle from './DeviceToggle';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import AuthSync from '@/components/account/AuthSync';
import { api } from '@/lib/api';

/**
 * Decides between rendering the site directly (desktop / inside the preview iframe)
 * or rendering a device "stage" that loads the site in a phone/tablet-sized iframe.
 */
export default function AppShell({ children }) {
  const device = useDevice((s) => s.device);
  const [mounted, setMounted] = useState(false);
  const [embedded, setEmbedded] = useState(false);

  useEffect(() => {
    api.wake();
    setEmbedded(window.self !== window.top);
    setMounted(true);
  }, []);

  if (mounted && !embedded && device !== 'desktop') return <DeviceStage />;

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <CartDrawer />
      <AuthSync />
      {mounted && !embedded && <DeviceToggle floating />}
    </>
  );
}
