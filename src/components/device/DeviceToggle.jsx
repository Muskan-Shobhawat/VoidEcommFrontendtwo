'use client';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import SmartphoneOutlinedIcon from '@mui/icons-material/SmartphoneOutlined';
import TabletMacOutlinedIcon from '@mui/icons-material/TabletMacOutlined';
import DesktopWindowsOutlinedIcon from '@mui/icons-material/DesktopWindowsOutlined';
import { DEVICES, useDevice } from '@/store/device';

const ICONS = { mobile: SmartphoneOutlinedIcon, tablet: TabletMacOutlinedIcon, desktop: DesktopWindowsOutlinedIcon };

export default function DeviceToggle({ floating = false }) {
  const { device, setDevice } = useDevice();

  const group = (
    <ToggleButtonGroup
      size="small"
      exclusive
      value={device}
      onChange={(_, v) => v && setDevice(v)}
      sx={{
        '& .MuiToggleButton-root': { border: 0, px: 1.4, color: 'text.secondary', gap: 0.75, textTransform: 'uppercase', fontSize: 10, letterSpacing: '0.18em', fontWeight: 600 },
        '& .Mui-selected': { color: 'var(--paper) !important', bgcolor: 'var(--ink) !important' },
      }}
    >
      {Object.entries(DEVICES).map(([key, d]) => {
        const Icon = ICONS[key];
        return (
          <ToggleButton key={key} value={key} aria-label={d.label}>
            <Tooltip title={d.hint} placement="top">
              <span className="inline-flex items-center gap-1.5">
                <Icon sx={{ fontSize: 16 }} />
                <span className="hidden sm:inline">{d.label}</span>
              </span>
            </Tooltip>
          </ToggleButton>
        );
      })}
    </ToggleButtonGroup>
  );

  if (!floating) return group;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] bg-paper border hairline p-1 pl-3 flex items-center gap-2 shadow-[0_18px_50px_-12px_rgba(0,0,0,0.35)]">
      <span className="label text-mute hidden md:inline">Preview</span>
      {group}
    </div>
  );
}
