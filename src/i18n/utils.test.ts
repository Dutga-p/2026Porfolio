import { describe, expect, it } from 'vitest';
import { getAlternateLang, getLangFromUrl, getLocalizedPath } from './utils';

describe('getLangFromUrl', () => {
  it('detects the language prefix from the pathname', () => {
    expect(getLangFromUrl(new URL('https://dcom.agency/en/'))).toBe('en');
  });

  it('falls back to the default language for the root path', () => {
    expect(getLangFromUrl(new URL('https://dcom.agency/'))).toBe('es');
  });

  it('falls back to the default language for an unknown prefix', () => {
    expect(getLangFromUrl(new URL('https://dcom.agency/fr/'))).toBe('es');
  });
});

describe('getLocalizedPath', () => {
  it('returns the root path for the default language', () => {
    expect(getLocalizedPath('es')).toBe('/');
  });

  it('returns a prefixed path for a non-default language', () => {
    expect(getLocalizedPath('en')).toBe('/en/');
  });
});

describe('getAlternateLang', () => {
  it('toggles from es to en', () => {
    expect(getAlternateLang('es')).toBe('en');
  });

  it('toggles from en to es', () => {
    expect(getAlternateLang('en')).toBe('es');
  });
});
