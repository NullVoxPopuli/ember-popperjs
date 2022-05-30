'use strict';

import fs from 'fs/promises';
import fse from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { execa } from 'execa';
import { assert } from 'chai';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const addonPath = path.join(__dirname, '..', '..', 'ember-popperjs');

async function main() {
  await build();

  let expected = await getExpected();
  let results = await assertExists(expected);

  expected.sort();

  console.debug({ results });

  assert.strictEqual(results.every(entry => entry.exists), true);
}

async function build() {
  if (process.env.CI) {
    await execa('pnpm', ['run', 'build:js'], {
      cwd: addonPath,
      preferLocal: true,
      stdio: 'inherit',
    });

    return;
  }

  await execa('pnpm', ['run', 'build:js'], { cwd: addonPath, preferLocal: true });
}

async function getExpected() {
  let expectedFile = await fs.readFile(path.join(__dirname, 'expected-output-files.txt'));
  let expected = expectedFile.toString().split('\n');

  return expected.filter(Boolean);
}

async function assertExists(fileList) {
  return await Promise.all(fileList.map(async filePath => {
    return { filePath, exists: await fse.pathExists(addonPath, 'dist', filePath) }
  }));

}

main();
