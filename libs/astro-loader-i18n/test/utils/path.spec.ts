import { describe, expect, it } from 'vitest';
import { createCommonTranslationId, parseFilenameSuffix, trimSlashes } from '../../src/utils/path';

describe('trimSlashes', () => {
  it('should trim the slashes', () => {
    const trimmed = trimSlashes('/de/page/');
    expect(trimmed).toBe('de/page');
  });

  it("shouldn't trim single slash", () => {
    const trimmed = trimSlashes('/');
    expect(trimmed).toBe('/');
  });

  it('should trim only leading slash if there is no trailing slash', () => {
    const trimmed = trimSlashes('/de/page');
    expect(trimmed).toBe('de/page');
  });

  it('should trim only trailing slash if there is no leading slash', () => {
    const trimmed = trimSlashes('de/page/');
    expect(trimmed).toBe('de/page');
  });
});

describe('parseFilenameSuffix', () => {
  it('should estimate the language in a filename', () => {
    const { estimatedLocale } = parseFilenameSuffix('index.de.md', 'en');
    expect(estimatedLocale).toBe('de');
  });

  it('should estimate the exact locale in a filename', () => {
    const { estimatedLocale } = parseFilenameSuffix('index.de-CH.md', 'en');
    expect(estimatedLocale).toBe('de-CH');
  });

  it('should return the default locale if no locale was found in filename', () => {
    const { estimatedLocale } = parseFilenameSuffix('index.md', 'en');
    expect(estimatedLocale).toBe('en');
  });

  it('should return the filename without extensions, even when there is no locale', () => {
    const { filename } = parseFilenameSuffix('index.md', 'en');
    expect(filename).toBe('index');
  });

  it('should return the filename without extensions', () => {
    const { filename } = parseFilenameSuffix('index.en-US.md', 'en');
    expect(filename).toBe('index');
  });
});

describe('createCommonTranslationId', () => {
  it('should return the locale page id', () => {
    const commonTranslationId = createCommonTranslationId('/this/is/an/english-page');
    expect(commonTranslationId).toBe('this.is.an.english-page');
  });
  it('should return the locale page id without prefix', () => {
    const commonTranslationId = createCommonTranslationId('/en/this/is/an/english-page', 'en');
    expect(commonTranslationId).toBe('this.is.an.english-page');
  });
  it('should return index for index pages', () => {
    const commonTranslationId = createCommonTranslationId('/');
    expect(commonTranslationId).toBe('index');
  });
  it('should return index for index pages without prefix', () => {
    const commonTranslationId = createCommonTranslationId('/en/', 'en');
    expect(commonTranslationId).toBe('index');
  });
});
