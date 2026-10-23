'use client';
import { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useColorScheme } from '@mui/material/styles';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';

/** Sun/moon switch between the light and dark themes; the choice is saved and shared with the device preview. */
export default function ThemeToggle({ withLabel = false }) {
  const { mode, systemMode, setMode } = useColorScheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const current = (mode === 'system' ? systemMode : mode) || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  const label = `Switch to ${next} theme`;
  const icon = mounted && current === 'dark' ? <LightModeOutlinedIcon fontSize="small" /> : <DarkModeOutlinedIcon fontSize="small" />;

  if (withLabel) {
    return (
      <button type="button" onClick={() => setMode(next)} className="inline-flex items-center gap-2 bg-transparent border-0 p-0 label text-mute hover:text-ink">
        {icon} {mounted ? `${next} theme` : 'Theme'}
      </button>
    );
  }
  return (
    <Tooltip title={label}>
      <IconButton aria-label={label} onClick={() => setMode(next)} sx={{ color: 'text.primary' }}>{icon}</IconButton>
    </Tooltip>
  );
}
