'use strict';

const { resolve } = require;

module.exports = {
  plugins: [
    [
      resolve('@babel/plugin-transform-typescript'),
      {
        allowDeclareFields: true,
        onlyRemoveTypeImports: true,
        // Default enums are IIFEs
        optimizeConstEnums: true,
      },
    ],
    [
      resolve('@babel/plugin-proposal-decorators'),
      {
        // The stage 1 implementation
        legacy: true,
      },
    ],
    // eslint-disable-next-line node/no-missing-require
    resolve('@embroider/addon-dev/template-colocation-plugin'),
  ],
};
