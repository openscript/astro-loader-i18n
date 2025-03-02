export type NormalizeLocales<T extends Locales> = {
  [K in keyof T]: T[K] extends string ? T[K] : T[K] extends {
      codes: Array<string>;
  } ? T[K]['codes'][number] : never;
}[number];
