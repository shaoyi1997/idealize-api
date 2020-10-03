import * as pkgDir from 'pkg-dir';

/**
 * Returns the absolute path to the project root.
 */
export function getProjectRoot() {
  return pkgDir.sync();
}

// /**
//  * Returns the source file's filename.
//  *
//  * When used from within a transpiled JavaScript file, the special variable __filename
//  * points to the path of the transpiled file. However, in many cases, we want the
//  * __filename as called from the untranspiled file.
//  *
//  * @returns The absolute path to the untranspiled file.
//  */
// export function sourceFilename() {
//   return getSourceFileName();
// }

// /**
//  * Like sourceFileName(), but for __dirname.
//  *
//  * @returns The absolute path to the directory containing the untranspiled file.
//  */
// export function sourceDirname() {
//   return path.dirname(getSourceFileName());
// }

// /**
//  * Called by sourceFilename and sourceDirname, so the stack depth from the caller
//  * should be the same.
//  */
// function getSourceFileName() {
//   const callerFileName = callsites()[2].getFileName();
//   const callerDirName = path.dirname(callerFileName);
//   const sourceMapPath = getSourceMapPath(callerFileName);

//   if (sourceMapPath) {
//     const fullSourceMapPath = path.join(
//       callerDirName,
//       getSourceMapPath(callerFileName),
//     );
//     const sourceMap = JSON.parse(fs.readFileSync(fullSourceMapPath, 'utf8'));

//     // Assume that the transpiled output has a 1-1 relationship with the source files.
//     return path.resolve(callerDirName, sourceMap.sources[0]);
//   } else {
//     return path.resolve(callerDirName, callerFileName);
//   }
// }

// /**
//  * Given a transpiled file, returns the path to its source map.
//  *
//  * @param path The transpiled file.
//  * @returns Path to the source map, relative to the transpiled file.
//  */
// function getSourceMapPath(path: string) {
//   const fileData = fs.readFileSync(path, 'utf8');

//   // https://github.com/evanw/node-source-map-support/blob/master/source-map-support.js#L140
//   const re = /(?:\/\/[@#][ \t]+sourceMappingURL=([^\s'"]+?)[ \t]*$)|(?:\/\*[@#][ \t]+sourceMappingURL=([^\*]+?)[ \t]*(?:\*\/)[ \t]*$)/gm;

//   let lastMatch;
//   let match;
//   // tslint:disable-next-line:no-conditional-assignment
//   while ((match = re.exec(fileData))) {
//     lastMatch = match;
//   }

//   return lastMatch ? lastMatch[1] : null;
// }
