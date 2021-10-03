'use strict';

const { stripIndents } = require('common-tags');

module.exports = {
  name: require('./package').name,

  options: {
    'ember-cli-babel': {
      enableTypeScriptTransform: true,
    },
    babel: {
      plugins: [require.resolve('ember-auto-import/babel-plugin')],
    },
    autoImport: {
      webpack: {
        node: {
          global: false,
          __filename: true,
          __dirname: true,
        },
        resolve: {
          fallback: {
            path: 'path-browserify',
          },
        },
      },
    },
  },

  included(app) {
    // Adds:
    //  - ember-template-compiler
    //  - @glimmer/syntax
    app.import('vendor/ember/ember-template-compiler.js');
  },
};

/**
 * Builds a file with a single export, COMPONENT_MAP, that
 * is a map of the provided paths *to* all exported identifiers
 * from each of the provided paths.
 *
 * This is helpful for building a map of imports to force to be included
 * in the build - a requirement for builds that tend to tree shake.
 *
 * @param {string[]} paths - list of import paths for each module that you want availableb to the REPL
 */
module.exports.buildComponentMap = function buildComponentMap(paths) {
  const writeFile = require('broccoli-file-creator');
  const fileContent = stripIndents`
    ${paths
      .map((path, i) => {
        return `import * as ComponentMapPart${i} from '${path}';`;
      })
      .join('\n')}

    export const COMPONENT_MAP = {
      ${paths
        .map((path, i) => {
          return `'${path}': ComponentMapPart${i},`;
        })
        .join('\n')}
    };
  `;

  const tree = writeFile('/ember-popperjs/component-map.js', fileContent);

  return tree;
};
