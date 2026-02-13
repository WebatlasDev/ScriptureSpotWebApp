'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';

export const ADAPTIVE_FONT_SCALE_STORAGE_KEY = 'adaptiveFontScaleStep';
export const ADAPTIVE_FONT_SCALE_DEFAULT_STEP = -1;
export const ADAPTIVE_FONT_SCALE_MIN_STEP = -2;
export const ADAPTIVE_FONT_SCALE_MAX_STEP = 2;
export const ADAPTIVE_FONT_SCALE_STEP_SIZE = 0.12;

type Listener = () => void;

const listeners = new Set<Listener>();
let didInitialize = false;
let currentStep = ADAPTIVE_FONT_SCALE_DEFAULT_STEP;

const clampStep = (value: number): number => {
  if (Number.isNaN(value)) {
    return ADAPTIVE_FONT_SCALE_DEFAULT_STEP;
  }
  return Math.min(ADAPTIVE_FONT_SCALE_MAX_STEP, Math.max(ADAPTIVE_FONT_SCALE_MIN_STEP, value));
};

const readStoredStep = () => {
  if (typeof window === 'undefined') {
    return ADAPTIVE_FONT_SCALE_DEFAULT_STEP;
  }

  try {
    const raw = window.localStorage.getItem(ADAPTIVE_FONT_SCALE_STORAGE_KEY);
    if (raw === null) {
      return ADAPTIVE_FONT_SCALE_DEFAULT_STEP;
    }

    const parsed = Number(raw);
    if (Number.isNaN(parsed)) {
      return ADAPTIVE_FONT_SCALE_DEFAULT_STEP;
    }

    return clampStep(parsed);
  } catch {
    return ADAPTIVE_FONT_SCALE_DEFAULT_STEP;
  }
};

const ensureInitialized = () => {
  if (didInitialize) {
    return;
  }

  currentStep = readStoredStep();
  didInitialize = true;
};

const emitChange = () => {
  listeners.forEach(listener => listener());
};

export const getAdaptiveFontScaleStep = (): number => {
  ensureInitialized();
  return currentStep;
};

export const setAdaptiveFontScaleStep = (value: number) => {
  ensureInitialized();
  const next = clampStep(value);

  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(ADAPTIVE_FONT_SCALE_STORAGE_KEY, next.toString());
    } catch {
      // Ignore storage failures but keep state updated
    }
  }

  if (next === currentStep) {
    return;
  }

  currentStep = next;
  emitChange();
};

export const resetAdaptiveFontScaleStep = () => {
  setAdaptiveFontScaleStep(ADAPTIVE_FONT_SCALE_DEFAULT_STEP);
};

const subscribe = (listener: Listener) => {
  ensureInitialized();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

if (typeof window !== 'undefined') {
  window.addEventListener('storage', event => {
    if (event.key !== ADAPTIVE_FONT_SCALE_STORAGE_KEY) {
      return;
    }

    const nextValue = event.newValue === null
      ? ADAPTIVE_FONT_SCALE_DEFAULT_STEP
      : clampStep(Number(event.newValue));

    if (nextValue === currentStep) {
      return;
    }

    currentStep = nextValue;
    emitChange();
  });
}

export const useAdaptiveFontScale = () => {
  const fontScaleStep = useSyncExternalStore(
    subscribe,
    getAdaptiveFontScaleStep,
    () => ADAPTIVE_FONT_SCALE_DEFAULT_STEP,
  );

  const setFontScaleStep = useCallback((next: number) => {
    setAdaptiveFontScaleStep(next);
  }, []);

  const resetFontScaleStep = useCallback(() => {
    resetAdaptiveFontScaleStep();
  }, []);

  const fontScale = useMemo(
    () => 1 + fontScaleStep * ADAPTIVE_FONT_SCALE_STEP_SIZE,
    [fontScaleStep],
  );

  return {
    fontScaleStep,
    fontScale,
    setFontScaleStep,
    resetFontScaleStep,
  };
};
