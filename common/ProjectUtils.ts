import * as pkgDir from 'pkg-dir';

/**
 * Returns the absolute path to the project root.
 */
export function getProjectRoot() {
  return pkgDir.sync();
}
