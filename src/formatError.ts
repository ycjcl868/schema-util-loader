'use strict';

import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';

const getFileExcerptIfPossible = (err: any) => {
  try {
    const content = fs.readFileSync(err.file, 'utf8');

    return `${os.EOL +
      content.split(os.EOL)[err.line - 1] +
      os.EOL +
      new Array(err.column - 1).join(' ')}^${os.EOL}      `;
  } catch (ignoreErr) {
    // If anything goes wrong here, we don't want any errors to be reported to the user
    return '';
  }
};

export default (err: any, resourcePath: string) => {
  err.hideStack = false;

  if (!err.file) {
    return;
  }

  let msg = err.message;

  if (err.file === 'stdin') {
    err.file = resourcePath;
  }

  err.file = path.normalize(err.file);

  msg = msg.replace(/\s*Current dir:\s*/, '');

  err.message = `${getFileExcerptIfPossible(err) +
    msg.charAt(0).toUpperCase() +
    msg.slice(1) +
    os.EOL}      in ${err.file} (line ${err.line}, column ${err.column})`;
};
