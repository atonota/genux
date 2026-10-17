/// <reference types="vite/client" />
/** Local controller of one inline example preview. Device, theme, orientation and grid stay
    local to the example and only restyle its same-page mockup, so the demo tree keeps all
    state; nothing navigates or remounts. The page Tweaker follows the focused example. */
import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import {
  previewDeviceDefinition,
  previewOrientation,
  type PreviewDevice,
  type PreviewOrientation,
} from '../data/preview-devices';
import {
  DEFAULT_PREVIEW_PROFILE,
  previewProfileDevice,
  previewProfileForDevice,
} from '../preview/profiles';
import { getThemeSnapshot, type ThemeMode } from '../theme';
import { focusLocalPreview, releaseLocalPreview } from './PreviewContext';

// The first mounted preview is the initial local Tweaker target.
let focusedPreviewId: string | null = null;

// GitHub Pages serves the docs under a base path; normalized to one trailing slash.
const base = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

export type PreviewFrame = {
  device: PreviewDevice;
  theme: ThemeMode;
  orientation: PreviewOrientation;
  grid: boolean;
  /** Open alone URL of the standalone route for the current local choices and profile. */
  standaloneSrc: string;
  setDevice(device: PreviewDevice): void;
  setTheme(mode: ThemeMode): void;
  rotate(): void;
  setGrid(on: boolean): void;
  /** Opens the page Demo Tweaker through its existing trigger. */
  openSettings(): void;
  focus(): void;
};

type Local = {
  device: PreviewDevice;
  theme: ThemeMode;
  requested: PreviewOrientation | undefined;
  grid: boolean;
};

/** Local choices as query parameters; the preview document validates them once. */
function choiceParams({ device, theme, requested, grid }: Local): URLSearchParams {
  const params = new URLSearchParams();
  if (theme !== 'light') params.set('theme', theme);
  if (previewDeviceDefinition(device).rotatable)
    params.set('orientation', previewOrientation(device, requested));
  if (grid) params.set('grid', '1');
  return params;
}

export function usePreviewFrame({
  id,
  anchorRef,
}: {
  id: string;
  /** An element inside the page Demo owner; openSettings uses that owner's Tweaker trigger. */
  anchorRef?: RefObject<HTMLElement | null>;
}): PreviewFrame {
  const initialDevice = previewProfileDevice(DEFAULT_PREVIEW_PROFILE);
  const [device, setDeviceState] = useState<PreviewDevice>(initialDevice);
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [requested, setRequested] = useState<PreviewOrientation>();
  const [grid, setGrid] = useState(false);
  // Synchronous device/orientation mirrors used by the stable rotation callback.
  const local = useRef<Pick<Local, 'device' | 'requested'>>({
    device: initialDevice,
    requested: undefined,
  });
  const initialized = useRef(false);

  const setDevice = useCallback((next: PreviewDevice) => {
    local.current.device = next;
    setDeviceState(next);
  }, []);
  const rotate = useCallback(() => {
    const { device: current, requested: wanted } = local.current;
    if (!previewDeviceDefinition(current).rotatable) return;
    const next = previewOrientation(current, wanted) === 'portrait' ? 'landscape' : 'portrait';
    local.current.requested = next;
    setRequested(next);
  }, []);
  const focus = useCallback(() => {
    focusedPreviewId = id;
    focusLocalPreview(id);
  }, [id]);
  /** The example's settings live in the page Demo Tweaker: the nearest .genux-demo owner that
      holds its existing trigger opens it, so focus return stays with that Tweaker. This example
      becomes the local target first; without its registration the Tweaker would fall back to
      the global token editors, so it stays closed. */
  const openSettings = useCallback(() => {
    focusedPreviewId = id;
    const available = focusLocalPreview(id);
    if (!available) return;
    let owner = anchorRef?.current?.closest('.genux-demo') ?? null;
    while (owner) {
      const trigger = owner.querySelector<HTMLElement>('.genux-tweaker-trigger button');
      if (trigger) {
        trigger.click();
        return;
      }
      owner = owner.parentElement?.closest('.genux-demo') ?? null;
    }
  }, [anchorRef, id]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    // One read of the outer theme after hydration; the preview never subscribes to or writes it.
    setTheme(getThemeSnapshot());
  }, [setTheme]);

  useEffect(() => {
    // The first mounted owner is also the Tweaker's local target; its registration notifies later.
    if (focusedPreviewId === null) {
      focusedPreviewId = id;
      focusLocalPreview(id);
    }
    return () => {
      if (focusedPreviewId === id) focusedPreviewId = null;
      releaseLocalPreview(id);
    };
  }, [id]);

  const standalone = choiceParams({ device, theme, requested, grid }).toString();
  return {
    device,
    theme,
    orientation: previewOrientation(device, requested),
    grid,
    standaloneSrc: `${base}preview/${encodeURIComponent(id)}/${previewProfileForDevice(device)}/${
      standalone ? `?${standalone}` : ''
    }`,
    setDevice,
    setTheme,
    rotate,
    setGrid,
    openSettings,
    focus,
  };
}
