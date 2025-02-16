export interface GenerateIdOptions {
  /** The path to the entry file, relative to the base directory. */
  entry: string;
  /** The base directory URL. */
  base: URL;
  /** The parsed, unvalidated data of the entry. */
  data: Record<string, unknown>;
}
export interface GlobOptions {
  /** The glob pattern to match files, relative to the base directory */
  pattern: string | Array<string>;
  /** The base directory to resolve the glob pattern from. Relative to the root directory, or an absolute file URL. Defaults to `.` */
  base?: string | URL;
  /**
   * Function that generates an ID for an entry. Default implementation generates a slug from the entry path.
   * @returns The ID of the entry. Must be unique per collection.
   **/
  generateId?: (options: GenerateIdOptions) => string;
}
