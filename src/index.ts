// import { getOptions } from 'loader-utils';
import * as webpack from 'webpack';
import { schema } from 'schema-util';
import formatError from './formatError';

export default function (source: string) {
  const { resourcePath, callback } = this as webpack.loader.LoaderContext;
  const isSync = typeof callback !== 'function';
  if (isSync) {
    throw new Error(
      'Synchronous compilation is not supported anymore.'
    );
  }
  // const options = getOptions(this);
  try {
    const schemaStr = JSON.stringify(schema(source))
      .replace(/\u2028/g, '\\u2028')
      .replace(/\u2029/g, '\\u2029');
    ;
    return `module.exports = ${schemaStr}`;
  } catch (e) {
    e.message = `parse schema error ${e.message}`
    const err = formatError(e, resourcePath)
    throw err;
  }
}
